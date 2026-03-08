# WebRTC Integration for RTSP Cameras

## Overview
This integration enables real-time streaming of RTSP camera feeds through WebRTC, providing low-latency video streaming directly in the browser with AI analytics overlay.

## Architecture

```
RTSP Cameras → FFmpeg → WebRTC Server → Socket.IO → React Client
     ↓              ↓           ↓            ↓           ↓
  47 Cameras    Transcoding  Signaling   Real-time   Video Player
                              Server     Communication  + AI Overlay
```

## Components

### 1. WebRTC Signaling Server (`server/webrtc-server.js`)
- **Socket.IO server** for WebRTC signaling
- **FFmpeg integration** for RTSP to WebRTC conversion
- **Stream management** for multiple concurrent cameras
- **Client connection handling**

### 2. WebRTC Player Component (`components/WebRTCPlayer.tsx`)
- **Real-time video streaming** with WebRTC
- **AI detection overlay** with bounding boxes
- **Stream controls** (play/pause/mute/fullscreen)
- **Connection status monitoring**
- **Error handling and retry logic**

### 3. Updated Analytics Dashboard
- **Integrated WebRTC player** in LiveAnalytics component
- **Real-time detection callbacks**
- **Synchronized analytics data**

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup WebRTC Environment
```bash
npm run setup-webrtc
```

This will:
- Check for FFmpeg installation
- Create deployment configurations
- Generate Docker and PM2 configs

### 3. Install FFmpeg (Required)

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from: https://ffmpeg.org/download.html#build-windows
```

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install ffmpeg
```

### 4. Start Services

**Development (Both servers):**
```bash
npm run dev:full
```

**Or start separately:**
```bash
# Terminal 1: WebRTC Server
npm run webrtc

# Terminal 2: Next.js App
npm run dev
```

### 5. Test Integration
```bash
npm run test:cameras
```

## Usage

### 1. Access Camera Dashboard
Navigate to: `http://localhost:3000/dashboard/cameras`

### 2. Start WebRTC Stream
1. Click on any camera tile
2. Select AI model (Face Recognition, Person Detection, etc.)
3. Click "Start Analytics"
4. WebRTC player will initialize and connect to RTSP stream

### 3. Real-time Features
- **Live video streaming** with low latency
- **AI detection overlays** with bounding boxes
- **Real-time statistics** and detection logs
- **Stream controls** and fullscreen mode

## Configuration

### Environment Variables
```bash
# .env.local
WEBRTC_SERVER_PORT=8080
WEBRTC_ICE_SERVERS=stun:stun.l.google.com:19302
MONGODB_URI=mongodb://localhost:27017/jeeja_fashion
```

### Camera Configuration
Each camera supports:
- **RTSP URL**: `rtsp://65.1.214.31:8554/cam{1-47}`
- **WebRTC transcoding** via FFmpeg
- **Multiple concurrent viewers**
- **AI model selection**

## Production Deployment

### 1. Using PM2
```bash
pm2 start ecosystem.config.js
```

### 2. Using Docker
```bash
docker-compose up --build
```

### 3. Using Systemd (Linux)
```bash
sudo systemctl enable webrtc-camera
sudo systemctl start webrtc-camera
```

### 4. Nginx Reverse Proxy
The setup includes nginx configuration for:
- **Load balancing**
- **SSL termination**
- **WebSocket proxying**

## Performance Optimization

### 1. FFmpeg Settings
```bash
# Low latency settings
-preset ultrafast
-tune zerolatency
-f mp4
-movflags frag_keyframe+empty_moov
```

### 2. WebRTC Configuration
```javascript
// ICE servers for NAT traversal
iceServers: [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
]
```

### 3. Bandwidth Management
- **Adaptive bitrate** based on connection quality
- **Stream quality selection** (720p/1080p)
- **Concurrent stream limits**

## Troubleshooting

### Common Issues

**1. FFmpeg Not Found**
```bash
# Check installation
ffmpeg -version

# Install if missing (see setup instructions above)
```

**2. WebRTC Connection Failed**
```bash
# Check firewall settings
# Ensure ports 8080 and 3000 are open
# Verify STUN/TURN server accessibility
```

**3. RTSP Stream Issues**
```bash
# Test RTSP URL directly
ffplay rtsp://65.1.214.31:8554/cam1

# Check camera network connectivity
ping 65.1.214.31
```

**4. High CPU Usage**
```bash
# Reduce concurrent streams
# Lower video quality/framerate
# Use hardware acceleration if available
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=socket.io* node server/webrtc-server.js
```

## Security Considerations

### 1. Authentication
- **JWT tokens** for camera access
- **Role-based permissions** for different camera zones
- **Session management** for analytics

### 2. Network Security
- **HTTPS/WSS** for encrypted communication
- **CORS configuration** for allowed origins
- **Rate limiting** for API endpoints

### 3. Camera Access
- **VPN requirements** for RTSP access
- **IP whitelisting** for camera network
- **Credential management** for RTSP authentication

## Future Enhancements

### 1. Advanced Features
- **Multi-camera view** (2x2, 3x3 grids)
- **PTZ camera controls** (pan/tilt/zoom)
- **Recording and playback** functionality
- **Motion detection triggers**

### 2. AI Integration
- **Real-time model switching**
- **Custom model training**
- **Alert notifications** for specific detections
- **Historical analytics** and reporting

### 3. Scalability
- **Kubernetes deployment**
- **Load balancer integration**
- **CDN for video distribution**
- **Edge computing** for local processing

## API Reference

### WebRTC Server Events

**Client → Server:**
```javascript
// Request stream
socket.emit('request-stream', { cameraId: 1, rtspUrl: 'rtsp://...' });

// WebRTC signaling
socket.emit('webrtc-offer', { cameraId: 1, offer: sdp });
socket.emit('webrtc-answer', { cameraId: 1, answer: sdp });
socket.emit('ice-candidate', { cameraId: 1, candidate: ice });

// Stop stream
socket.emit('stop-stream', { cameraId: 1 });
```

**Server → Client:**
```javascript
// Stream ready
socket.on('stream-ready', ({ cameraId }) => {});

// WebRTC signaling
socket.on('webrtc-answer', ({ cameraId, answer }) => {});
socket.on('ice-candidate', ({ cameraId, candidate }) => {});

// Video data (for fallback)
socket.on('video-data', ({ cameraId, data }) => {});

// Errors
socket.on('stream-error', ({ error }) => {});
```

This WebRTC integration provides a robust foundation for real-time RTSP camera streaming with AI analytics capabilities.