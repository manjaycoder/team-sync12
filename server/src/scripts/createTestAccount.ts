import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { User } from '../models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const createTestAccount = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Test accounts cannot be created in production.');
  }

  const email = process.env.TEST_ACCOUNT_EMAIL?.trim().toLowerCase();
  const password = process.env.TEST_ACCOUNT_PASSWORD;

  if (!email || !password) {
    throw new Error('Set TEST_ACCOUNT_EMAIL and TEST_ACCOUNT_PASSWORD in server/.env.');
  }

  if (password.length < 12) {
    throw new Error('TEST_ACCOUNT_PASSWORD must be at least 12 characters long.');
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team-sync';
  await mongoose.connect(mongoUri);

  try {
    const existingUser = await User.findOne({ email }).select('+password');
    if (existingUser) {
      existingUser.password = password;
      await existingUser.save();
      console.log(`Test account password updated for ${email}.`);
      return;
    }

    await User.create({
      name: 'Test Account',
      email,
      password,
      role: 'Team Member',
      department: 'Engineering',
    });
    console.log(`Test account created for ${email}.`);
  } finally {
    await mongoose.connection.close();
  }
};

createTestAccount().catch((error: unknown) => {
  console.error('[Test Account] Failed to create account:', error);
  process.exitCode = 1;
});
