import mongoose from 'mongoose';

export const connectDB = async (retries = 5, delayMs = 3000): Promise<void> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/team-sync';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[MongoDB] Connecting to database (Attempt ${attempt}/${retries})...`);
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Successfully connected: ${conn.connection.host}/${conn.connection.name}`);
      return;
    } catch (error: any) {
      console.error(`[MongoDB] Connection attempt ${attempt} failed:`, error.message);
      if (attempt < retries) {
        console.log(`[MongoDB] Retrying in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error('================================================================');
        console.error('[MongoDB] FATAL: Unable to connect to MongoDB.');
        console.error('[MongoDB] Check your MONGO_URI environment variable on Render.');
        console.error('[MongoDB] If using MongoDB Atlas, ensure Network Access allows 0.0.0.0/0');
        console.error('================================================================');
        if (process.env.NODE_ENV === 'production') {
          // On Render, allow server to stay alive for diagnostics or health endpoint
          console.warn('[MongoDB] Running in degraded mode until MongoDB is reachable.');
        } else {
          process.exit(1);
        }
      }
    }
  }
};
