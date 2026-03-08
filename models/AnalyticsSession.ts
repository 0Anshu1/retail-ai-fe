import mongoose from 'mongoose';

const AnalyticsSessionSchema = new mongoose.Schema({
  cameraId: { type: Number, required: true },
  modelType: { 
    type: String, 
    enum: ['face_recognition', 'person_detection', 'object_detection', 'crowd_analysis', 'behavior_analysis'], 
    required: true 
  },
  sessionId: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  detections: [{
    timestamp: { type: Date, default: Date.now },
    confidence: { type: Number },
    boundingBox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    },
    label: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  statistics: {
    totalDetections: { type: Number, default: 0 },
    averageConfidence: { type: Number, default: 0 },
    peakActivity: { type: Date },
    uniquePersons: { type: Number, default: 0 }
  }
});

export default mongoose.models.AnalyticsSession || mongoose.model('AnalyticsSession', AnalyticsSessionSchema);