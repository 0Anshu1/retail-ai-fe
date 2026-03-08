'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Play, Pause, Volume2, VolumeX, Maximize2, AlertCircle } from 'lucide-react';

interface WebRTCPlayerProps {
  cameraId: number;
  rtspUrl: string;
  onDetection?: (detection: any) => void;
  className?: string;
}

export default function WebRTCPlayer({ cameraId, rtspUrl, onDetection, className = '' }: WebRTCPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string>('');
  const [connectionState, setConnectionState] = useState<string>('disconnected');

  useEffect(() => {
    initializeWebRTC();
    return () => {
      cleanup();
    };
  }, [cameraId, rtspUrl]);

  const initializeWebRTC = async () => {
    try {
      // Connect to signaling server
      socketRef.current = io('http://localhost:8080');
      
      socketRef.current.on('connect', () => {
        console.log('Connected to signaling server');
        setIsConnected(true);
        setConnectionState('connected');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from signaling server');
        setIsConnected(false);
        setConnectionState('disconnected');
      });

      socketRef.current.on('stream-ready', (data) => {
        console.log(`Stream ready for camera ${data.cameraId}`);
        setupWebRTCConnection();
      });

      socketRef.current.on('stream-error', (data) => {
        console.error('Stream error:', data.error);
        setError(data.error);
        setConnectionState('error');
      });

      socketRef.current.on('webrtc-answer', (data) => {
        handleWebRTCAnswer(data.answer);
      });

      socketRef.current.on('ice-candidate', (data) => {
        handleICECandidate(data.candidate);
      });

      // For demo purposes, we'll use a mock video stream
      socketRef.current.on('video-data', (data) => {
        // In production, this would handle actual video data
        console.log(`Received video data for camera ${data.cameraId}`);
      });

    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      setError('Failed to initialize connection');
      setConnectionState('error');
    }
  };

  const setupWebRTCConnection = async () => {
    try {
      // Create RTCPeerConnection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Handle connection state changes
      peerConnectionRef.current.onconnectionstatechange = () => {
        const state = peerConnectionRef.current?.connectionState;
        console.log('WebRTC connection state:', state);
        setConnectionState(state || 'disconnected');
      };

      // Handle incoming streams
      peerConnectionRef.current.ontrack = (event) => {
        console.log('Received remote stream');
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          setIsPlaying(true);
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', {
            cameraId,
            candidate: event.candidate
          });
        }
      };

      // Create offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      // Send offer to signaling server
      if (socketRef.current) {
        socketRef.current.emit('webrtc-offer', {
          cameraId,
          offer
        });
      }

    } catch (error) {
      console.error('Failed to setup WebRTC connection:', error);
      setError('Failed to setup video connection');
    }
  };

  const handleWebRTCAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error('Failed to handle WebRTC answer:', error);
    }
  };

  const handleICECandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error('Failed to handle ICE candidate:', error);
    }
  };

  const startStream = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('request-stream', {
        cameraId,
        rtspUrl
      });
      setError('');
    }
  };

  const stopStream = () => {
    if (socketRef.current) {
      socketRef.current.emit('stop-stream', { cameraId });
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopStream();
    } else {
      startStream();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const cleanup = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  // Mock detection overlay for demo
  const drawDetectionOverlay = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || !isPlaying) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mock detection box
    if (Math.random() > 0.7) { // 30% chance of showing detection
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 80, 120, 160);
      
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(100, 55, 140, 25);
      
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText('Person 94%', 105, 72);
      
      // Trigger detection callback
      if (onDetection) {
        onDetection({
          id: `det_${Date.now()}`,
          timestamp: new Date(),
          confidence: 0.94,
          boundingBox: { x: 100, y: 80, width: 120, height: 160 },
          label: 'Person'
        });
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(drawDetectionOverlay, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={isMuted}
      />
      
      {/* Detection Overlay Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Connection Status */}
      <div className="absolute top-3 left-3 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          connectionState === 'connected' ? 'bg-green-500 animate-pulse' :
          connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' :
          connectionState === 'error' ? 'bg-red-500' :
          'bg-gray-500'
        }`}></div>
        <span className="text-white text-xs font-medium">
          {connectionState === 'connected' ? 'LIVE' :
           connectionState === 'connecting' ? 'CONNECTING' :
           connectionState === 'error' ? 'ERROR' :
           'OFFLINE'}
        </span>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlay}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          
          <button
            onClick={toggleMute}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <div className="text-sm font-medium">Connection Error</div>
            <div className="text-xs opacity-75 mt-1">{error}</div>
            <button
              onClick={startStream}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {!isPlaying && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-sm font-medium">Connecting to Camera {cameraId}</div>
            <div className="text-xs opacity-75 mt-1">{rtspUrl}</div>
            {!isConnected && (
              <button
                onClick={startStream}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Start Stream
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}