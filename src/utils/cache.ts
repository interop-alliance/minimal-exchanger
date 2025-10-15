/// <reference types="../types.d.ts" />
import { LruCache } from '@digitalcredentials/lru-memoize'
import { VC_API_EXCHANGE_TIMEOUT } from '../config.default'

declare global {
  var rpRequestCache: any | undefined
  var rpResponseCache: any | undefined
}

// identical shape as V+, just using LruCache
export const rpRequestCache =
  globalThis.rpRequestCache ||
  new LruCache({
    maxAge: VC_API_EXCHANGE_TIMEOUT as number
  })

export const rpResponseCache =
  globalThis.rpResponseCache ||
  new LruCache({
    maxAge: VC_API_EXCHANGE_TIMEOUT as number
  })

globalThis.rpRequestCache = rpRequestCache
globalThis.rpResponseCache = rpResponseCache
