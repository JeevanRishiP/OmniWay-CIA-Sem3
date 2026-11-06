import mongoose from 'mongoose';

let cachedPromise = null;
let memoryServerInstance = null;

/**
 * Connect to MongoDB with cached promise for serverless environments.
 * In development, falls back to embedded in-memory MongoDB if URI is not reachable.
 * @param {string} [uri] - MongoDB URI (defaults to process.env.MONGODB_URI)
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB(uri = process.env.MONGODB_URI) {
  // If already connected, reuse connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
    // Note: Do NOT set family: 4, as AWS Lambda / Vercel requires dual-stack DNS resolution for Atlas SRV
  };

  if (uri) {
    if (!cachedPromise) {
      cachedPromise = mongoose.connect(uri, options).then((conn) => {
        console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
        return conn;
      });
    }

    try {
      return await cachedPromise;
    } catch (err) {
      cachedPromise = null;
      console.error(`[Database] Connection to '${uri}' failed: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
    }
  }

  // Development Fallback: Embedded In-Memory MongoDB
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Database] Initializing embedded in-memory database for local development...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memUri = memoryServerInstance.getUri();
      const conn = await mongoose.connect(memUri, options);
      console.log(`[Database] Embedded in-memory MongoDB started and connected successfully! (${memUri})`);
      return conn;
    } catch (memErr) {
      throw new Error(`Failed to initialize development in-memory MongoDB: ${memErr.message}`);
    }
  }

  throw new Error('MONGODB_URI is required in production environment.');
}

/**
 * Disconnect from MongoDB gracefully
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    cachedPromise = null;
    console.log('[Database] MongoDB disconnected cleanly.');
  }
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
    console.log('[Database] In-memory MongoDB stopped.');
  }
}

mongoose.connection.on('disconnected', () => {
  cachedPromise = null;
  console.warn('[Database] MongoDB connection lost.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected.');
});
