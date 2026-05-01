import mongoose from 'mongoose';
import dns from 'dns';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Critical: Override DNS to Google DNS before any MongoDB connection.
// This fixes ECONNREFUSED on SRV lookups in restricted network environments.
if (typeof window === 'undefined') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    // DNS servers already set
  }
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      dbName: 'campusconnect',
    };

    console.log('Database: Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('Database: Connected successfully');
      return m;
    }).catch(err => {
      console.error('Database: Connection error:', err.message);
      cached.promise = null;
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
