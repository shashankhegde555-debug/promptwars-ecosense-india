import NodeCache from 'node-cache';
import { createHash } from 'crypto';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

/**
 * Generates an MD5 cache key from input data.
 * @param {string} prefix - Cache namespace prefix
 * @param {*} data - Data to hash
 * @returns {string} Cache key
 */
export function cacheKey(prefix, data) {
  const hash = createHash('md5').update(JSON.stringify(data)).digest('hex');
  return `${prefix}${hash}`;
}

export function cacheGet(key) {
  return cache.get(key) ?? null;
}

export function cacheSet(key, value, ttl = 3600) {
  cache.set(key, value, ttl);
}

export function cacheDel(key) {
  cache.del(key);
}

export function cacheStats() {
  return cache.getStats();
}
