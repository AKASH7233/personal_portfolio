/**
 * MongoDB Connection and Helper Utilities
 * Handles database connection and CRUD operations
 */

import { MongoClient } from 'mongodb';

let client = null;
let db = null;

/**
 * Connect to MongoDB
 * @returns {Promise<Object>} Database instance
 */
export async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

/**
 * Close MongoDB connection
 */
export async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ Closed MongoDB connection');
  }
}

/**
 * Upsert a document in a collection
 * @param {string} collectionName - Collection name
 * @param {Object} filter - Query filter
 * @param {Object} data - Data to insert/update
 * @returns {Promise<Object>} Result
 */
export async function upsertDocument(collectionName, filter, data) {
  const database = await connectDB();
  const collection = database.collection(collectionName);
  
  const result = await collection.updateOne(
    filter,
    { 
      $set: { 
        ...data, 
        updatedAt: new Date() 
      } 
    },
    { upsert: true }
  );
  
  return result;
}

/**
 * Find a single document
 * @param {string} collectionName - Collection name
 * @param {Object} filter - Query filter
 * @returns {Promise<Object|null>} Document or null
 */
export async function findDocument(collectionName, filter) {
  const database = await connectDB();
  const collection = database.collection(collectionName);
  return await collection.findOne(filter);
}

/**
 * Find multiple documents
 * @param {string} collectionName - Collection name
 * @param {Object} filter - Query filter
 * @param {Object} options - Query options (sort, limit, etc.)
 * @returns {Promise<Array>} Array of documents
 */
export async function findDocuments(collectionName, filter = {}, options = {}) {
  const database = await connectDB();
  const collection = database.collection(collectionName);
  return await collection.find(filter, options).toArray();
}

/**
 * Delete documents matching filter
 * @param {string} collectionName - Collection name
 * @param {Object} filter - Query filter
 * @returns {Promise<Object>} Result
 */
export async function deleteDocuments(collectionName, filter) {
  const database = await connectDB();
  const collection = database.collection(collectionName);
  return await collection.deleteMany(filter);
}

/**
 * Insert multiple documents
 * @param {string} collectionName - Collection name
 * @param {Array} documents - Array of documents
 * @returns {Promise<Object>} Result
 */
export async function insertMany(collectionName, documents) {
  const database = await connectDB();
  const collection = database.collection(collectionName);
  return await collection.insertMany(documents);
}
