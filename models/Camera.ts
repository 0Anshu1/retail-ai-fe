import mongoose from 'mongoose';

const CameraSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  zone: { type: String, required: true },
  rtspUrl: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline', 'recording'], default: 'online' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Camera || mongoose.model('Camera', CameraSchema);