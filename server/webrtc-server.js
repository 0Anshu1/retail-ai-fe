const { Server } = require('socket.io');
const { createServer } = require('http');
const { spawn } = require('child_process');
const express = require('express');

class WebRTCServer {
  constructor(port = 8080) {
    this.port = port;
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"]
      }
    });
    this.activeStreams = new Map();
    this.setupRoutes();
    this.setupSocketHandlers();
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        activeStreams: this.activeStreams.size,
        timestamp: new Date().toISOString()
      });
    });

    // Stream status endpoint
    this.app.get('/streams', (req, res) => {
      const streams = Array.from(this.activeStreams.keys()).map(cameraId => ({
        cameraId,
        clients: this.activeStreams.get(cameraId)?.clients?.length || 0
      }));
      res.json({ streams });
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle stream request
      socket.on('request-stream', async (data) => {
        const { cameraId, rtspUrl } = data;
        console.log(`Stream requested for camera ${cameraId}: ${rtspUrl}`);
        
        try {
          await this.startStream(socket, cameraId, rtspUrl);
        } catch (error) {
          console.error('Failed to start stream:', error);
          socket.emit('stream-error', { error: error.message });
        }
      });

      // Handle WebRTC offer
      socket.on('webrtc-offer', (data) => {
        const { cameraId, offer } = data;
        console.log(`WebRTC offer received for camera ${cameraId}`);
        
        // In a real implementation, you'd handle the WebRTC negotiation here
        // For now, we'll simulate the process
        this.handleWebRTCOffer(socket, cameraId, offer);
      });

      // Handle WebRTC answer
      socket.on('webrtc-answer', (data) => {
        const { cameraId, answer } = data;
        console.log(`WebRTC answer received for camera ${cameraId}`);
        this.handleWebRTCAnswer(socket, cameraId, answer);
      });

      // Handle ICE candidates
      socket.on('ice-candidate', (data) => {
        const { cameraId, candidate } = data;
        console.log(`ICE candidate received for camera ${cameraId}`);
        this.handleICECandidate(socket, cameraId, candidate);
      });

      // Handle stream stop
      socket.on('stop-stream', (data) => {
        const { cameraId } = data;
        this.stopStream(cameraId);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        // Clean up any streams for this client
        this.cleanupClientStreams(socket.id);
      });
    });
  }

  async startStream(socket, cameraId, rtspUrl) {
    // Check if stream is already active
    if (this.activeStreams.has(cameraId)) {
      const stream = this.activeStreams.get(cameraId);
      if (!stream.clients.includes(socket.id)) {
        stream.clients.push(socket.id);
      }
      
      // If we have an initialization segment, send it to the new client
      if (stream.initSegment) {
        socket.emit('video-init', { cameraId, data: stream.initSegment.toString('base64') });
      }
      
      socket.emit('stream-ready', { cameraId });
      return;
    }

    console.log(`Starting real stream for camera ${cameraId}`);

    // Start FFmpeg process to convert RTSP to fragmented MP4
    const ffmpegArgs = [
      '-rtsp_transport', 'tcp', // Use TCP for RTSP to avoid UDP packet loss
      '-i', rtspUrl,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-tune', 'zerolatency',
      '-an', // Disable audio for now to reduce bandwidth and complexity
      '-f', 'mp4',
      '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
      'pipe:1'
    ];

    const ffmpeg = spawn('ffmpeg', ffmpegArgs);
    
    let accumulatedBuffer = Buffer.alloc(0);
    let initSegmentFound = false;

    ffmpeg.stdout.on('data', (data) => {
      if (!initSegmentFound) {
        accumulatedBuffer = Buffer.concat([accumulatedBuffer, data]);
        // Search for 'moov' atom which marks the end of the initialization segment in fragmented MP4
        const moovIndex = accumulatedBuffer.indexOf(Buffer.from('moov'));
        if (moovIndex !== -1) {
          // Find the end of the moov atom (typically moov atom is small, but let's be safe)
          // For simplicity in fragmented MP4, the moov atom follows the ftyp atom.
          // We'll take the buffer up to this point and a bit more to be sure we have the full atom.
          // Actually, in fragmented MP4, 'ftyp' then 'moov' is the init segment.
          // Subsequent data will be 'moof' + 'mdat' (fragments).
          
          // Heuristic: the first 'moof' marks the start of the first fragment.
          const moofIndex = accumulatedBuffer.indexOf(Buffer.from('moof'));
          if (moofIndex !== -1) {
            const initSegment = accumulatedBuffer.slice(0, moofIndex);
            const firstFragment = accumulatedBuffer.slice(moofIndex);
            
            this.activeStreams.get(cameraId).initSegment = initSegment;
            socket.emit('video-init', { cameraId, data: initSegment.toString('base64') });
            initSegmentFound = true;
            
            // Send the remaining part of the chunk as the first fragment
            this.broadcastVideoData(cameraId, firstFragment);
            accumulatedBuffer = Buffer.alloc(0); // Clear accumulated buffer
          }
        }
      } else {
        // Init segment already sent, broadcast fragments
        this.broadcastVideoData(cameraId, data);
      }
    });

    ffmpeg.stderr.on('data', (data) => {
      // Optional: Log only errors, not progress
      const msg = data.toString();
      if (msg.includes('Error') || msg.includes('error')) {
        console.error(`FFmpeg error [${cameraId}]: ${msg}`);
      }
    });

    ffmpeg.on('close', (code) => {
      console.log(`FFmpeg process exited for camera ${cameraId} with code ${code}`);
      const stream = this.activeStreams.get(cameraId);
      if (stream) {
        stream.clients.forEach(clientId => {
          const clientSocket = this.io.sockets.sockets.get(clientId);
          if (clientSocket) {
            clientSocket.emit('stream-error', { error: 'Stream closed' });
          }
        });
      }
      this.activeStreams.delete(cameraId);
    });

    this.activeStreams.set(cameraId, {
      process: ffmpeg,
      clients: [socket.id],
      initSegment: null
    });

    socket.emit('stream-ready', { cameraId });
  }

  broadcastVideoData(cameraId, data) {
    const stream = this.activeStreams.get(cameraId);
    if (stream) {
      const base64Data = data.toString('base64');
      stream.clients.forEach(clientId => {
        const clientSocket = this.io.sockets.sockets.get(clientId);
        if (clientSocket) {
          clientSocket.emit('video-data', { cameraId, data: base64Data });
        }
      });
    }
  }

  handleWebRTCOffer(socket, cameraId, offer) {
    // Simulate WebRTC negotiation
    // In production, use a proper WebRTC library like node-webrtc
    const mockAnswer = {
      type: 'answer',
      sdp: 'mock-sdp-answer'
    };
    
    socket.emit('webrtc-answer', { cameraId, answer: mockAnswer });
  }

  handleWebRTCAnswer(socket, cameraId, answer) {
    // Handle the answer from client
    console.log(`Processing WebRTC answer for camera ${cameraId}`);
  }

  handleICECandidate(socket, cameraId, candidate) {
    // Handle ICE candidate exchange
    console.log(`Processing ICE candidate for camera ${cameraId}`);
  }

  stopStream(cameraId) {
    const stream = this.activeStreams.get(cameraId);
    if (stream) {
      stream.process.kill();
      this.activeStreams.delete(cameraId);
      console.log(`Stopped stream for camera ${cameraId}`);
    }
  }

  cleanupClientStreams(clientId) {
    // Remove client from all active streams
    for (const [cameraId, stream] of this.activeStreams.entries()) {
      const clientIndex = stream.clients.indexOf(clientId);
      if (clientIndex > -1) {
        stream.clients.splice(clientIndex, 1);
        
        // If no more clients, stop the stream
        if (stream.clients.length === 0) {
          this.stopStream(cameraId);
        }
      }
    }
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`WebRTC signaling server running on port ${this.port}`);
    });

    this.server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`Port ${this.port} is already in use. Checking if it's already a WebRTC server...`);
        // We can just exit gracefully since the existing process is likely our server
        // In a real app we might want to check /health before deciding to exit
        // For development, we'll just allow the other process to keep running.
        process.exit(0); 
      } else {
        console.error('Server error:', e);
      }
    });
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new WebRTCServer(8080);
  server.start();
}

module.exports = WebRTCServer;