const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function findUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.connection.collection('users');
    const users = await User.find({ email: /raj/i }).toArray();
    console.log('Matching users:', users);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findUser();
