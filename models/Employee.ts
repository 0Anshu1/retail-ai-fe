import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  faceId?: string; // Mock Face ID reference
  designation: string;
  department: 'Sales' | 'Billing' | 'Security' | 'Management' | 'Inventory';
  showroom: string;
  status: 'active' | 'inactive';
  productivityScore: number; // 0-100
  createdAt: Date;
}

const EmployeeSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  faceId: { type: String },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  showroom: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  productivityScore: { type: Number, default: 80 },
}, { timestamps: true });

export const Employee: Model<IEmployee> = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
