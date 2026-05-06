import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/lib/models/User';
import { Room } from './src/lib/models/Room';
import { Mess } from './src/lib/models/Mess';

dotenv.config({ path: '.env.local' });

async function claimOwnership() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected!');

    const targetEmail = 'raj@gmail.com';
    console.log(`Searching for user with email: ${targetEmail}...`);
    
    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      console.error('User not found! Please make sure you signed up correctly.');
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (UID: ${user.uid})`);
    
    console.log('Updating all rooms...');
    const roomResult = await Room.updateMany({}, { $set: { ownerId: user.uid } });
    console.log(`Updated ${roomResult.modifiedCount} rooms.`);

    console.log('Updating all messes...');
    const messResult = await Mess.updateMany({}, { $set: { ownerId: user.uid } });
    console.log(`Updated ${messResult.modifiedCount} messes.`);

    console.log('Success! You are now the owner of all properties.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

claimOwnership();
