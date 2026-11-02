import mongoose from 'mongoose';

const MAX_RETRIES = process.env.NODE_ENV === 'production' ? 5 : 2;
const INITIAL_RETRY_DELAY_MS = 1000;
let memoryServerInstance = null;

/**
 * Connect to MongoDB with connection pooling and retry logic
 * Automatically falls back to an embedded in-memory MongoDB instance in development if local mongod is not running.
 * @param {string} [uri] - MongoDB URI (defaults to process.env.MONGODB_URI)
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB(uri = process.env.MONGODB_URI) {
  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 45000,
    family: 4
  };

  // If already connected, return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  let targetUri = uri;

  // Try configured URI first
  if (targetUri) {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        attempt++;
        const conn = await mongoose.connect(targetUri, options);
        console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn(`[Database] Connection attempt ${attempt} to '${targetUri}' failed: ${err.message}`);
        if (attempt >= MAX_RETRIES) {
          break;
        }
        const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  // If in production and failed, throw error
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Failed to connect to MongoDB at '${targetUri}' after ${MAX_RETRIES} attempts.`);
  }

  // Development Fallback: In-Memory MongoDB Server
  console.log('[Database] Local MongoDB not detected. Initializing embedded in-memory database for seamless local development...');
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create();
    targetUri = memoryServerInstance.getUri();
    const conn = await mongoose.connect(targetUri, options);
    console.log(`[Database] Embedded in-memory MongoDB started and connected successfully! (${targetUri})`);
    return conn;
  } catch (memErr) {
    throw new Error(`Failed to initialize development in-memory MongoDB: ${memErr.message}`);
  }
}

/**
 * Disconnect from MongoDB gracefully
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] MongoDB disconnected cleanly.');
  }
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
    console.log('[Database] In-memory MongoDB stopped.');
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection lost.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected.');
});
