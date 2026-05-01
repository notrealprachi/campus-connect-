import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { Room } from './src/lib/models/Room';
import { Mess } from './src/lib/models/Mess';
import { User } from './src/lib/models/User';
import { Review } from './src/lib/models/Review';

// DNS override for restricted networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

const mockRooms = [
  {
    id: "room-1",
    name: "Deluxe Boys PG",
    location: "Maratha Colony, Kasaba Bawada",
    rent: 2500,
    description: "Premium boys PG with attached bathroom and 24x7 water supply. Close to DYP college.",
    totalBeds: 10,
    occupiedBeds: 4,
    collegeDistance: 0.5,
    facilities: { basic: ["WiFi", "Study Table"], appliances: ["Fan"], security: ["CCTV"] },
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"],
    ownerId: "dummy-owner-1",
    rating: 4.5,
    reviewCount: 2
  },
  {
    id: "room-2",
    name: "Sunshine Girls Hostel",
    location: "Gruhayog, Kasaba Bawada",
    rent: 3000,
    description: "Safe and secure girls hostel with strictly enforced timings and good food nearby.",
    totalBeds: 20,
    occupiedBeds: 18,
    collegeDistance: 1.2,
    facilities: { basic: ["WiFi"], appliances: ["Washing Machine"], security: ["Security Guard", "Girls Only"] },
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop"],
    ownerId: "dummy-owner-1",
    rating: 4.8,
    reviewCount: 5
  }
];

const mockMesses = [
  {
    id: "mess-1",
    name: "Annapurna Mess Service",
    location: "Randive Galli",
    fees: { boys: 2000, girls: 1800 },
    collegeDistance: 0.8,
    menu: {
      monday: { lunch: "Chapati, Bhaji, Dal", dinner: "Paneer Masala, Rice" },
      tuesday: { lunch: "Chapati, Bhaji, Dal", dinner: "Veg Kolhapuri" }
    },
    images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"],
    ownerId: "dummy-owner-1",
    rating: 4.2,
    reviewCount: 3
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!, { dbName: 'campusconnect', serverSelectionTimeoutMS: 15000 });
    console.log('Connected!');

    // Drop legacy index if it exists
    await mongoose.connection.db?.collection('rooms').dropIndex('id_1').catch(() => {});
    await mongoose.connection.db?.collection('messes').dropIndex('id_1').catch(() => {});

    console.log('Clearing old data...');
    await Room.deleteMany({});
    await Mess.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

    console.log('Inserting dummy user...');
    await User.create({
      uid: 'dummy-owner-1',
      name: 'Rajesh Owner',
      email: 'rajesh@example.com',
      role: 'roomOwner'
    });

    console.log('Inserting rooms...');
    await Room.insertMany(mockRooms);

    console.log('Inserting messes...');
    await Mess.insertMany(mockMesses);

    console.log('Database successfully seeded!');
  } catch (e) {
    console.error('Seeding failed:', e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
