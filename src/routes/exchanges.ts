import type { FastifyInstance } from 'fastify'
import { v4 as uuidv4 } from 'uuid'
import { exchanges } from '../utils/cache'
import { EXCHANGE_SERVER_URL } from '../config.default'

export async function initExchangeRoutes(app: FastifyInstance) {
  app.post('/workflows/ephemeral/exchanges', async (request, response) => {
    const body = request.body as any
    const requestData = body?.request

    if (!requestData) {
      return response.status(400).send({ error: 'Missing "request" field' })
    }
    if (!requestData.credentialRequestOrigin) {
      return response.status(400).send({ error: 'Missing "credentialRequestOrigin" field' })
    }

    const exchangeId = uuidv4()
    const key = `exchange:${exchangeId}`

    exchanges.memoize({
      key,
      fn: async () => requestData
    })

    const baseUrl =
      (app as any).serverUrl ||
      'http://localhost:8080'

    const exchangeUrl = `${baseUrl}/workflows/ephemeral/exchanges/${exchangeId}`

    return response.code(201).header('Location', exchangeUrl).send()
  })
}
