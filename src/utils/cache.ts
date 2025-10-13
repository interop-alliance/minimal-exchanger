/// <reference types="../types.d.ts" />
import { LruCache } from '@digitalcredentials/lru-memoize'
import { VC_API_EXCHANGE_TIMEOUT } from '../config.default'

declare global {
  var exchanges: any | undefined
}

export async function pollExchange({
  exchangeUrl,
  onFetchVP,
  stopPolling
}: {
  exchangeUrl: string
  onFetchVP: (vp: any) => void
  stopPolling: () => void
}): Promise<void> {
  const result = await fetch(exchangeUrl, {})

  if (result.ok && result.status === 200) {
    const vp = (await result.json()) as any
    console.log('Fetched vp:', typeof vp, vp)
    onFetchVP(vp)
    stopPolling()
  }
}

// identical shape as V+, just using LruCache
export const exchanges =
  globalThis.exchanges ||
  new LruCache({
    maxAge: VC_API_EXCHANGE_TIMEOUT as number
  })

globalThis.exchanges = exchanges
