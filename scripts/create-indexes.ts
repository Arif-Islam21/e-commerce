import { getDatabase } from "@/lib/db/client"

async function createIndexes() {
  const db = await getDatabase()
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("products").createIndex({ slug: 1 }, { unique: true }),
    db.collection("products").createIndex({ categoryId: 1, status: 1, createdAt: -1 }),
    db.collection("products").createIndex({ name: "text", description: "text" }),
    db.collection("categories").createIndex({ slug: 1 }, { unique: true }),
    db.collection("carts").createIndex({ userId: 1 }, { unique: true, sparse: true }),
    db.collection("carts").createIndex({ guestId: 1 }, { unique: true, sparse: true }),
    db.collection("wishlists").createIndex({ userId: 1 }, { unique: true }),
    db.collection("orders").createIndex({ userId: 1, createdAt: -1 }),
    db.collection("orders").createIndex({ status: 1, createdAt: -1 }),
    db.collection("payments").createIndex({ orderId: 1 }, { unique: true }),
    db.collection("coupons").createIndex({ code: 1 }, { unique: true }),
    db.collection("reviews").createIndex({ productId: 1, status: 1, createdAt: -1 }),
    db.collection("reviews").createIndex({ productId: 1, userId: 1 }, { unique: true }),
    db.collection("newsletters").createIndex({ email: 1 }, { unique: true }),
    db.collection("store_settings").createIndex({ key: 1 }, { unique: true }),
  ])
  console.log("Database indexes created")
}

createIndexes().catch((error) => { console.error(error); process.exitCode = 1 })
