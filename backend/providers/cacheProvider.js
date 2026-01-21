/**
 * Cache Provider
 * Cung cấp caching layer (có thể dùng Redis sau này)
 */

// Simple in-memory cache (có thể thay thế bằng Redis)
const cache = new Map();

/**
 * Lấy giá trị từ cache
 */
export const get = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  
  // Kiểm tra expired
  if (item.expiresAt && item.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  
  return item.value;
};

/**
 * Lưu giá trị vào cache
 */
export const set = (key, value, ttlSeconds = 3600) => {
  const expiresAt = ttlSeconds > 0 ? Date.now() + (ttlSeconds * 1000) : null;
  cache.set(key, { value, expiresAt });
};

/**
 * Xóa giá trị khỏi cache
 */
export const del = (key) => {
  cache.delete(key);
};

/**
 * Xóa tất cả cache
 */
export const clear = () => {
  cache.clear();
};

/**
 * Kiểm tra key có tồn tại không
 */
export const has = (key) => {
  return cache.has(key);
};

/**
 * Lấy tất cả keys
 */
export const keys = () => {
  return Array.from(cache.keys());
};

/**
 * Lấy cache stats
 */
export const getStats = () => {
  return {
    size: cache.size,
    keys: keys()
  };
};

