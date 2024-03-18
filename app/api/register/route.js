import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/UserModel';
export async function POST(req) {
  await mongoose.connect(process.env.NEXT_PUBLIC_Mongodb_url);
  console.log('connected to mongodb');
  const { name, email, password } = await req.json();
  console.log(name, email, password);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  return Response.json(user);
}
