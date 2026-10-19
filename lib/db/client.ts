import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!uri) throw new Error("MONGODB_URI is not configured")
if (!dbName) throw new Error("MONGODB_DB is not configured")

const globalForMongo = globalThis as unknown as { mongoClientPromise?: Promise<MongoClient> }

const clientPromise = globalForMongo.mongoClientPromise ?? new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
}).connect()

if (process.env.NODE_ENV !== "production") globalForMongo.mongoClientPromise = clientPromise

export async function getDatabase(): Promise<Db> {
  return (await clientPromise).db(dbName)
}

export async function closeDatabase(): Promise<void> {
  if (process.env.NODE_ENV !== "production") await (await clientPromise).close()
}
