import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMess extends Document {
  name: string;
  location: string;
  fees: {
    boys: number;
    girls: number;
  };
  menu: {
    monday: { lunch: string; dinner: string };
    tuesday: { lunch: string; dinner: string };
    wednesday: { lunch: string; dinner: string };
    thursday: { lunch: string; dinner: string };
    friday: { lunch: string; dinner: string };
    saturday: { lunch: string; dinner: string };
    sunday: { lunch: string; dinner: string };
  };
  collegeDistance: number;
  images: string[];
  ownerId: string;
  rating: number;
  reviewCount: number;
}

const MessSchema = new Schema<IMess>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  fees: {
    boys: { type: Number, required: true },
    girls: { type: Number, required: true },
  },
  menu: {
    monday: { lunch: String, dinner: String },
    tuesday: { lunch: String, dinner: String },
    wednesday: { lunch: String, dinner: String },
    thursday: { lunch: String, dinner: String },
    friday: { lunch: String, dinner: String },
    saturday: { lunch: String, dinner: String },
    sunday: { lunch: String, dinner: String },
  },
  collegeDistance: { type: Number, required: true },
  images: [String],
  ownerId: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Mess: Model<IMess> = mongoose.models.Mess || mongoose.model<IMess>('Mess', MessSchema);
