import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'owner' | 'store_manager' | 'supervisor' | 'security';
  showroom?: string; // Optional showroom ID assignment
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'store_manager', 'supervisor', 'security'], default: 'store_manager' },
  showroom: { type: String }, // Could be ObjectId if Showroom model exists
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
