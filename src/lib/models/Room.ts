import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  location: string;
  rent: number;
  gender: 'Boys' | 'Girls';
  description: string;
  totalBeds: number;
  occupiedBeds: number;
  collegeDistance: number;
  facilities: {
    basic: string[];
    appliances: string[];
    security: string[];
  };
  expectedVacancyDate?: Date;
  vacancyStatus: 'Available' | 'Few Beds Left' | 'No Vacancy' | 'Vacancy Coming Soon';
  images: string[];
  ownerId: string;
  rating: number;
  reviewCount: number;
}

const RoomSchema = new Schema<IRoom>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rent: { type: Number, required: true },
  gender: { type: String, enum: ['Boys', 'Girls'], required: true },
  description: { type: String, required: true },
  totalBeds: { type: Number, required: true },
  occupiedBeds: { type: Number, default: 0 },
  collegeDistance: { type: Number, required: true },
  facilities: {
    basic: { type: [String], default: [] },
    appliances: { type: [String], default: [] },
    security: { type: [String], default: [] },
  },
  expectedVacancyDate: { type: Date },
  vacancyStatus: { 
    type: String, 
    enum: ['Available', 'Few Beds Left', 'No Vacancy', 'Vacancy Coming Soon'],
    default: 'Available'
  },
  images: [String],
  ownerId: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
