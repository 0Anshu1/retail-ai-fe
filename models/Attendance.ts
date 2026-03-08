import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date; // Normalized to start of day
  entryTime: Date;
  exitTime?: Date;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  mobileUsageMinutes: number;
}

const AttendanceSchema: Schema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date },
  totalHours: { type: Number, default: 0 },
  status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], default: 'present' },
  mobileUsageMinutes: { type: Number, default: 0 },
}, { timestamps: true });

export const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
