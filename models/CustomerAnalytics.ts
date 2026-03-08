import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomerAnalytics extends Document {
  date: Date;
  showroom: string;
  totalFootfall: number;
  peakHour: string; // e.g. "18:00"
  zones: {
    name: string; // "Saree", "Mens", "Kids", "Billing"
    count: number;
    avgWaitTime: number; // in minutes
  }[];
}

const CustomerAnalyticsSchema: Schema = new Schema({
  date: { type: Date, required: true },
  showroom: { type: String, required: true },
  totalFootfall: { type: Number, default: 0 },
  peakHour: { type: String },
  zones: [{
    name: { type: String, required: true },
    count: { type: Number, default: 0 },
    avgWaitTime: { type: Number, default: 0 },
    avgDwellTime: { type: Number, default: 0 }
  }]
}, { timestamps: true });

export const CustomerAnalytics: Model<ICustomerAnalytics> = mongoose.models.CustomerAnalytics || mongoose.model<ICustomerAnalytics>('CustomerAnalytics', CustomerAnalyticsSchema);
