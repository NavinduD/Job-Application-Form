"use server";

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URL;

interface CachedConnection {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: CachedConnection = { connection: null, promise: null };

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGODB_URL environment variable inside .env.local"
    );
  }

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).catch((err) => {
      console.error("MongoDB connection error:", err.message);

      if (err.message.includes("IP address")) {
        console.error("Please whitelist your IP address in MongoDB Atlas");
      }

      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.connection;
}
