import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Check if user already exists
    let user = await User.findOne({ $or: [{ uid: body.uid }, { email: body.email }] });
    
    if (user) {
      // Update existing user if needed, or just return it
      user = await User.findByIdAndUpdate(user._id, body, { new: true });
    } else {
      user = await User.create(body);
    }
    
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user', details: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  const email = searchParams.get('email');
  
  try {
    await dbConnect();
    let user;
    if (uid) user = await User.findOne({ uid });
    else if (email) user = await User.findOne({ email });
    
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
