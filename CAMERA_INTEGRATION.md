# RTSP Camera Integration with AI Analytics

## Overview
The application now supports 47 live RTSP cameras with AI-powered recognition models for real-time analytics.

## Features

### 🎥 Live RTSP Cameras
- **47 cameras** distributed across different zones
- **RTSP URL format**: `rtsp://65.1.214.31:8554/cam{1-47}`
- **Real-time status monitoring** (online/offline)
- **Zone-based organization** (Entrance, Saree Section, Mens Wear, etc.)

### 🤖 AI Recognition Models
1. **Face Recognition**
   - Identity matching
   - Age estimation
   - Emotion detection
   - Face tracking

2. **Person Detection**
   - Person counting
   - Movement tracking
   - Dwell time analysis
   - Queue detection

3. **Object Detection**
   - Product recognition
   - Bag detection
   - Suspicious items
   - Inventory tracking

4. **Crowd Analysis**
   - Density mapping
   - Flow analysis
   - Congestion alerts
   - Peak time detection

5. **Behavior Analysis**
   - Loitering detection
   - Theft prevention
   - Fall detection
   - Aggressive behavior

### 📊 Live Analytics Dashboard
- **Real-time detection feed** with bounding boxes
- **Session statistics** (total detections, confidence, duration)
- **Detection log** with timestamps and confidence scores
- **Recording controls** (start/stop/pause)
- **Export capabilities** for analysis data

## Usage

### 1. Access Camera Dashboard
Navigate to `/dashboard/cameras` to view all 47 cameras.

### 2. Start Analytics
1. Click on any camera tile
2. Select desired AI model from the modal
3. Click "Start Analytics" to begin live analysis

### 3. View Live Results
- Real-time video feed with detection overlays
- Live statistics and metrics
- Detection history and logs
- Recording controls

## Technical Implementation

### Database Models
- **Camera**: Stores camera information and RTSP URLs
- **AnalyticsSession**: Tracks active analysis sessions
- **Detection logs**: Real-time detection data with metadata

### API Endpoints
- `GET /api/cameras` - Fetch all cameras
- `POST /api/analytics-session` - Start new analytics session
- `PATCH /api/analytics-session` - Update session data

### Components
- **ModelSelector**: AI model selection modal
- **LiveAnalytics**: Real-time analytics dashboard
- **Camera Grid**: Overview of all cameras

## Setup Instructions

### 1. Seed Database
```bash
curl -X POST http://localhost:3000/api/seed
```

### 2. Environment Variables
Ensure MongoDB connection is configured in `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/jeeja_fashion
```

### 3. RTSP Stream Integration
For production deployment, integrate with:
- **WebRTC** for low-latency streaming
- **HLS/DASH** for browser compatibility
- **FFmpeg** for stream processing

## Camera Zones Distribution
- **Entrance**: Cameras 1-3, 16-18, 31-33, 46-47
- **Saree Section**: Cameras 4-6, 19-21, 34-36
- **Mens Wear**: Cameras 7-9, 22-24, 37-39
- **Billing Counter**: Cameras 10-12, 25-27, 40-42
- **Kids Wear**: Cameras 13-15, 28-30, 43-45
- And more zones...

## Future Enhancements
- **Real RTSP player integration** (WebRTC/HLS)
- **Advanced analytics** (heat maps, path tracking)
- **Alert system** for suspicious activities
- **Historical data analysis** and reporting
- **Mobile app** for remote monitoring
- **Integration with existing security systems**

## Notes
- Current implementation uses placeholder video feeds
- In production, replace with actual RTSP stream players
- Consider bandwidth optimization for 47 concurrent streams
- Implement proper authentication for camera access