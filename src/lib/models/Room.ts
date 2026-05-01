import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  location: string;
  rent: number;
  description: string;
  totalBeds: number;
  occupiedBeds: number;
  collegeDistance: number;
  facilities: {
    basic: string[];
    appliances: string[];
    security: string[];
  };
  images: string[];
  ownerId: string;
  rating: number;
  reviewCount: number;
}

const RoomSchema = new Schema<IRoom>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rent: { type: Number, required: true },
  description: { type: String, required: true },
  totalBeds: { type: Number, required: true },
  occupiedBeds: { type: Number, default: 0 },
  collegeDistance: { type: Number, required: true },
  facilities: {
    basic: [String],
    appliances: [String],
    security: [String],
  },
  images: [String],
  ownerId: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
