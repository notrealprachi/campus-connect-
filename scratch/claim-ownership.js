const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function claimOwnership() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'campusconnect' });
    console.log('Connected!');

    const targetEmail = 'raj@gmail.com';
    
    // Find the user ID manually from the collection
    const User = mongoose.connection.collection('users');
    const user = await User.findOne({ email: targetEmail });
    
    if (!user) {
      console.error('User not found in "users" collection!');
      process.exit(1);
    }

    const uid = user.uid;
    console.log(`Found user: ${user.name} (UID: ${uid})`);
    
    const Rooms = mongoose.connection.collection('rooms');
    const Messes = mongoose.connection.collection('messes');

    console.log('Updating all rooms...');
    const roomResult = await Rooms.updateMany({}, { $set: { ownerId: uid } });
    console.log(`Updated ${roomResult.modifiedCount} rooms.`);

    console.log('Updating all messes...');
    const messResult = await Messes.updateMany({}, { $set: { ownerId: uid } });
    console.log(`Updated ${messResult.modifiedCount} messes.`);

    console.log('Success! You are now the owner of all properties.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

claimOwnership();
