import type { FastifyInstance } from 'fastify'
import { v4 as uuidv4 } from 'uuid'
import { rpRequestCache, rpResponseCache } from '../utils/cache'
import { EXCHANGE_SERVER_URL } from '../config.default'

export async function initExchangeRoutes(app: FastifyInstance) {
  app.post('/workflows/ephemeral/exchanges', async (request, response) => {
    const body = request.body as any
    const requestData = body?.request

    if (!requestData) {
      return response.status(400).send({ error: 'Missing "request" field' })
    }
    // if (!requestData.credentialRequestOrigin) {
    //   return response.status(400).send({ error: 'Missing "credentialRequestOrigin" field' })
    // }

    const exchangeId = uuidv4()
    const key = `exchange:${exchangeId}`

    rpRequestCache.memoize({
      key,
      fn: async () => requestData
    })

    const baseUrl =
      EXCHANGE_SERVER_URL || (app as any).serverUrl || 'http://localhost:8080'

    const exchangeUrl = `${baseUrl}/workflows/ephemeral/exchanges/${exchangeId}`

    return response
      .code(201)
      .header('Location', exchangeUrl)
      .send({ location: exchangeUrl })
  })

  app.post('/workflows/ephemeral/exchanges/:exchangeId', async (request, response) => {
    const { exchangeId } = request.params as any
    const body = request.body as any

    const isEmpty = !body || (Object.keys(body).length === 0 && body.constructor === Object)
    if (isEmpty) {
      const cachedRequest = rpRequestCache.get(`exchange:${exchangeId}`)
      if (!cachedRequest) return response.status(404).send()
      return response.send(cachedRequest)
    }
    rpResponseCache.memoize({
      key: `exchange:${exchangeId}`,
      fn: async () => body
    })
    return response.code(200).send(body)
  })

  app.get('/workflows/ephemeral/exchanges/:exchangeId', async (request, response) => {
    const { exchangeId } = request.params as any
    const req = rpRequestCache.get(`exchange:${exchangeId}`)
    if (!req) {
      return response.status(404).send() // not created or expired
    }

    const res = rpResponseCache.get(`exchange:${exchangeId}`)
    if (!res) {
      return response.send({
        id: exchangeId,
        sequence: 0,
        state: 'pending'
      })
    }

    return response.send({
      id: exchangeId,
      sequence: 1,
      state: 'complete',
      response: res
    })
  })
}
