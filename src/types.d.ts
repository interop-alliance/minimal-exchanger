declare module '@digitalcredentials/lru-memoize' {
  export interface LruCacheOptions {
    maxAge?: number;
    maxSize?: number;
  }

  export class LruCache<T = any> {
    constructor(options?: LruCacheOptions);
    memoize(options: { key: string; fn: () => Promise<T> }): Promise<T>;
  }
}