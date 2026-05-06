const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'campusconnect' });
    const User = mongoose.connection.collection('users');
    const users = await User.find({}).toArray();
    console.log('Current users in DB:', users.map(u => u.email));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listUsers();
