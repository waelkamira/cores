// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from 'mongodb';

if (!process.env.NEXT_PUBLIC_Mongodb_url) {
  throw new Error(
    'Invalid/Missing environment variable: "NEXT_PUBLIC_Mongodb_url"'
  );
}

const uri: string = process.env.NEXT_PUBLIC_Mongodb_url;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

//?داخله NODE_ENV لوضع  global يجب انشاء ملف
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).

  let globalWithMongoClientPromise = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
  };

  if (!globalWithMongoClientPromise._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongoClientPromise._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongoClientPromise._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
