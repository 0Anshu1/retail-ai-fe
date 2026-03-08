import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlert extends Document {
  type: 'security' | 'productivity' | 'crowd' | 'system';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  showroom: string;
  status: 'new' | 'acknowledged' | 'resolved';
  timestamp: Date;
}

const AlertSchema: Schema = new Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, required: true },
  showroom: { type: String, required: true },
  status: { type: String, default: 'new' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const Alert: Model<IAlert> = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
