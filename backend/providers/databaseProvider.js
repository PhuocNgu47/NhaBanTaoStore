/**
 * Database Provider
 * Cung cấp các hàm tiện ích để làm việc với database
 */

import mongoose from 'mongoose';

/**
 * Kiểm tra kết nối database
 */
export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Lấy database instance
 */
export const getDatabase = () => {
  return mongoose.connection.db;
};

/**
 * Lấy collection
 */
export const getCollection = (collectionName) => {
  return mongoose.connection.db.collection(collectionName);
};

/**
 * Thực hiện transaction
 */
export const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Kiểm tra collection có tồn tại không
 */
export const collectionExists = async (collectionName) => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  return collections.some(col => col.name === collectionName);
};

