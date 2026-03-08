'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface RTSPPlayerProps {
  cameraId: number;
  rtspUrl: string;
  onDetection?: (detection: any) => void;
  className?: string;
}

export default function RTSPPlayer({ cameraId, rtspUrl, onDetection, className = '' }: RTSPPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<any>(null);
  const hlsRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string>('');
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [streamType, setStreamType] = useState<'webrtc' | 'hls' | 'mock'>('mock');

  useEffect(() => {
    // Try different streaming methods
    initializeStream();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [cameraId, rtspUrl]);

  const initializeStream = async () => {
    setConnectionState('connecting');
    setError('');

    // Method 1: Try WebRTC (if server is running)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const response = await fetch('http://localhost:8080/health', { 
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('WebRTC server available, using WebRTC');
        setStreamType('webrtc');
        await initializeWebRTC();
        return;
      }
    } catch (error) {
      console.log('WebRTC server not available, trying alternatives...');
    } finally {
      clearTimeout(timeoutId);
    }

    // Method 2: Try HLS conversion (if available)
    try {
      const hlsUrl = `http://localhost:8080/hls/cam${cameraId}/index.m3u8`;
      const hlsController = new AbortController();
      const hlsTimeoutId = setTimeout(() => hlsController.abort(), 2000);
      
      const response = await fetch(hlsUrl, { 
        method: 'HEAD',
        signal: hlsController.signal
      });
      clearTimeout(hlsTimeoutId);
      
      if (response.ok) {
        console.log('HLS stream available');
        setStreamType('hls');
        await initializeHLS(hlsUrl);
        return;
      }
    } catch (error) {
      console.log('HLS not available, using mock stream...');
    }

    // Method 3: Use mock stream for demo
    setStreamType('mock');
    initializeMockStream();
  };

  const initializeWebRTC = async () => {
    if (!videoRef.current) return;

    try {
      const io = (await import('socket.io-client')).io;
      
      // Cleanup previous socket if any
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = io('http://localhost:8080');
      socketRef.current = socket;
      
      const mediaSource = new MediaSource();
      videoRef.current.src = URL.createObjectURL(mediaSource);
      
      let sourceBuffer: SourceBuffer | null = null;
      const queue: Uint8Array[] = [];

      mediaSource.addEventListener('sourceopen', () => {
        try {
          if (mediaSource.sourceBuffers.length === 0) {
            // Using a more common codec string for H.264
            sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
            sourceBuffer.mode = 'sequence';
            
            sourceBuffer.addEventListener('updateend', () => {
              if (queue.length > 0 && sourceBuffer && !sourceBuffer.updating) {
                sourceBuffer.appendBuffer(queue.shift()! as any);
              }
            });

            // Initial check if we already have data in queue
            if (queue.length > 0 && !sourceBuffer.updating) {
              sourceBuffer.appendBuffer(queue.shift()! as any);
            }
          }
        } catch (e) {
          console.error('Error adding source buffer', e);
          setError('Video format not supported');
        }
      });

      socket.on('connect', () => {
        console.log('Connected to stream server');
        setConnectionState('connected');
        socket.emit('request-stream', { cameraId, rtspUrl });
      });

      socket.on('video-init', (data: { data: string }) => {
        const binary = Uint8Array.from(atob(data.data), c => c.charCodeAt(0));
        console.log('Received video-init, size:', binary.length);
        if (sourceBuffer && !sourceBuffer.updating && queue.length === 0) {
          try {
            sourceBuffer.appendBuffer(binary as any);
          } catch (e) {
            console.error('Init segment append error', e);
            queue.push(binary);
          }
        } else {
          queue.push(binary);
        }
      });

      socket.on('video-data', (data: { data: string }) => {
        const binary = Uint8Array.from(atob(data.data), c => c.charCodeAt(0));
        if (sourceBuffer && !sourceBuffer.updating && queue.length === 0) {
          try {
            sourceBuffer.appendBuffer(binary as any);
          } catch (e) {
            console.error('Buffer append error', e);
            queue.push(binary);
          }
        } else {
          queue.push(binary);
        }
        
        if (!isPlaying) setIsPlaying(true);
      });

      socket.on('stream-error', (data) => {
        setError(data.error);
        setConnectionState('error');
      });
    } catch (e) {
      console.error('Failed to initialize socket stream', e);
      setError('Failed to connect to stream server');
    }
  };

  const initializeHLS = async (url: string) => {
    if (!videoRef.current) return;
    
    try {
      const Hls = (await import('hls.js')).default;
      
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS loaded and manifest parsed');
          videoRef.current?.play().catch(e => console.error('HLS play error', e));
          setIsPlaying(true);
          setConnectionState('connected');
        });
        
        hls.on(Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('HLS network error', data);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('HLS media error', data);
                hls.recoverMediaError();
                break;
              default:
                console.error('HLS fatal error', data);
                hls.destroy();
                setError('HLS playback failed');
                setConnectionState('error');
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoRef.current.src = url;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play();
          setIsPlaying(true);
          setConnectionState('connected');
        });
      } else {
        setError('HLS not supported in this browser');
        setConnectionState('error');
      }
    } catch (e) {
      console.error('Failed to initialize HLS', e);
      setError('Failed to load HLS player');
    }
  };

  const initializeMockStream = () => {
    setIsPlaying(true);
    setConnectionState('connected');
  };

  const drawMockDetections = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw mock detection boxes
    if (Math.random() > 0.6) { // 40% chance of showing detection
      const numDetections = Math.floor(Math.random() * 3) + 1; // 1-3 detections
      
      for (let i = 0; i < numDetections; i++) {
        const x = Math.random() * (canvas.width - 120);
        const y = Math.random() * (canvas.height - 160);
        const width = 80 + Math.random() * 40;
        const height = 120 + Math.random() * 40;
        const confidence = Math.floor((0.8 + Math.random() * 0.2) * 100);
        
        // Draw bounding box
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw label background
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x, y - 25, width, 25);
        
        // Draw label text
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`Person ${confidence}%`, x + 5, y - 8);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && streamType === 'mock') {
      const interval = setInterval(drawMockDetections, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, streamType]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setConnectionState('disconnected');
    } else {
      initializeStream();
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

  const getStreamTypeDisplay = () => {
    switch (streamType) {
      case 'webrtc': return 'WebRTC';
      case 'hls': return 'HLS';
      case 'mock': return 'DEMO';
      default: return 'OFFLINE';
    }
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Element or Mock Display */}
      {streamType === 'mock' ? (
        <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 relative">
          {/* Animated background to simulate video */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-r from-blue-900/30 to-purple-900/30 animate-pulse"></div>
          </div>
          
          {/* Mock camera info */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="text-lg font-semibold mb-2">Camera {cameraId} - Live Demo</div>
              <div className="text-sm opacity-75">{rtspUrl}</div>
              <div className="mt-4 text-xs">
                Simulated RTSP stream with AI detection
              </div>
            </div>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted={isMuted}
        />
      )}
      
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
        <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
          {connectionState === 'connected' ? `LIVE ${getStreamTypeDisplay()}` :
           connectionState === 'connecting' ? 'CONNECTING' :
           connectionState === 'error' ? 'ERROR' :
           'OFFLINE'}
        </span>
      </div>
      
      {/* Stream Type Badge */}
      <div className="absolute top-3 right-3">
        <span className={`text-xs px-2 py-1 rounded font-medium ${
          streamType === 'webrtc' ? 'bg-green-600 text-white' :
          streamType === 'hls' ? 'bg-blue-600 text-white' :
          streamType === 'mock' ? 'bg-orange-600 text-white' :
          'bg-gray-600 text-white'
        }`}>
          {getStreamTypeDisplay()}
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
          
          <div className="flex items-center space-x-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
            {connectionState === 'connected' ? (
              <Wifi className="h-3 w-3 text-green-400" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-400" />
            )}
            <span>Cam {cameraId}</span>
          </div>
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
              onClick={initializeStream}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {connectionState === 'connecting' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="text-sm font-medium">Connecting to Camera {cameraId}</div>
            <div className="text-xs opacity-75 mt-1">{rtspUrl}</div>
            <div className="text-xs opacity-50 mt-2">
              Trying WebRTC → HLS → Demo Mode
            </div>
          </div>
        </div>
      )}
    </div>
  );
}