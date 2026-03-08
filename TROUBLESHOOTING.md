# Camera Integration Troubleshooting

## 🔍 Quick Diagnosis

Run this command to check your setup:
```bash
npm run test:setup
```

## 🎥 Camera Not Showing Video

### Issue: "Connecting to Camera X" - Never Loads

**Cause**: The system is trying different streaming methods and falling back to demo mode.

**Solutions**:

1. **Check if servers are running**:
```bash
# Check Next.js (should show camera list)
curl http://localhost:3000/api/cameras

# Check WebRTC server (should show health status)
curl http://localhost:8080/health
```

2. **Start both servers**:
```bash
# Option 1: Start both together
npm run dev:full

# Option 2: Start separately
# Terminal 1:
npm run webrtc

# Terminal 2:
npm run dev
```

3. **If WebRTC server fails to start**:
```bash
# Install missing dependencies
npm install

# Check if port 8080 is available
netstat -an | findstr :8080

# Kill process if port is busy
npx kill-port 8080
```

### Issue: Demo Mode Works But Want Real Streams

**Current Status**: The system automatically falls back to demo mode with simulated AI detections when real RTSP streams aren't available.

**To Enable Real Streams**:

1. **Verify RTSP server connectivity**:
```bash
# Test if RTSP server is reachable
ping 65.1.214.31

# Test specific RTSP URL (requires VLC or FFmpeg)
ffplay rtsp://65.1.214.31:8554/cam1
```

2. **Check network access**:
   - Ensure you're on the same network as the cameras
   - Check if VPN is required
   - Verify firewall settings allow RTSP (port 8554)

3. **Install FFmpeg** (required for RTSP conversion):
```bash
# Windows (with Chocolatey)
choco install ffmpeg

# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Verify installation
ffmpeg -version
```

## 🚀 Current Working Features

Even without real RTSP streams, you can test:

1. **Camera Grid**: Shows all 47 cameras
2. **Model Selection**: Click any camera → Choose AI model
3. **Demo Analytics**: Simulated live detection with:
   - Animated detection boxes
   - Real-time statistics
   - Detection logs
   - Recording controls

## 🔧 Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Database
```bash
# Make sure MongoDB is running
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod
```

### 3. Seed Database
```bash
# Start Next.js first
npm run dev

# Then seed (in another terminal)
Invoke-RestMethod -Uri "http://localhost:3000/api/seed" -Method Post
```

### 4. Start Camera System
```bash
# Start both servers
npm run dev:full
```

### 5. Test the System
```bash
# Run diagnostics
npm run test:setup

# Test camera API
npm run test:cameras
```

### 6. Access Application
- **Main App**: http://localhost:3000
- **Camera Dashboard**: http://localhost:3000/dashboard/cameras
- **WebRTC Health**: http://localhost:8080/health

## 🎯 What Should Work Now

1. **Camera Grid**: All 47 cameras displayed
2. **Model Selection**: Interactive modal with 5 AI models
3. **Demo Analytics**: Simulated live stream with AI detection
4. **Real-time Stats**: Detection counts, confidence, session time
5. **Detection Log**: Live detection history
6. **Controls**: Play/pause, mute, fullscreen

## 🔄 Streaming Fallback Order

The system tries streaming methods in this order:

1. **WebRTC** (if server running + FFmpeg available)
2. **HLS** (if HLS streams available)
3. **Demo Mode** (always works - simulated stream)

## 📞 Common Error Messages

### "WebRTC server not available"
- **Solution**: Start WebRTC server with `npm run webrtc`

### "FFmpeg not found"
- **Solution**: Install FFmpeg (see installation commands above)

### "RTSP server not reachable"
- **Solution**: Check network connectivity to 65.1.214.31:8554

### "Connection timeout"
- **Solution**: Verify camera network access, check VPN

## 🎮 Demo Mode Features

When real streams aren't available, demo mode provides:

- **Simulated video background** with camera info
- **Animated detection boxes** appearing randomly
- **Realistic AI labels** (Person, Customer, Staff, Visitor)
- **Confidence scores** (85-100%)
- **Real-time statistics** updates
- **Detection history** logging

This lets you test the entire AI analytics workflow without needing actual camera access.

## 🔍 Debug Commands

```bash
# Check what's running on ports
netstat -an | findstr :3000
netstat -an | findstr :8080

# Test API endpoints
curl http://localhost:3000/api/cameras
curl http://localhost:8080/health

# Check MongoDB connection
mongosh --eval "db.adminCommand('ismaster')"

# View application logs
# (Check terminal where npm run dev is running)
```

## 📈 Next Steps

1. **Test with demo mode** to verify AI analytics workflow
2. **Set up network access** to RTSP cameras when ready
3. **Configure production deployment** using provided Docker/PM2 configs
4. **Add custom AI models** or integrate with existing ML pipelines

The system is designed to work immediately in demo mode and seamlessly upgrade to real streams when network access is available.