import type { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { rpRequestCache, rpResponseCache } from '../utils/cache';
import { EXCHANGE_SERVER_URL, RP_APP_URL } from '../config.default';

export async function initExchangeRoutes(app: FastifyInstance) {
  app.post('/workflows/ephemeral/exchanges', async (request, reply) => {
    const body = request.body as any;
    const requestData = body?.request;
    console.log('🚀 ~ initExchangeRoutes ~ requestData:', requestData);

    if (!requestData) {
      return reply.status(400).send({ error: 'Missing "request" field' });
    }

    const exchangeId = uuidv4();
    const key = `exchange:${exchangeId}`;

    rpRequestCache.memoize({ key, fn: () => Promise.resolve(requestData) });

    const baseUrl =
      EXCHANGE_SERVER_URL || (app as any).serverUrl || 'http://localhost:8080';

    const exchangeUrl = `${baseUrl}/workflows/ephemeral/exchanges/${exchangeId}`;

    return reply
      .code(201)
      .header('Location', exchangeUrl)
      .send({ location: exchangeUrl });
  });

  app.post(
    '/workflows/ephemeral/exchanges/:exchangeId',
    async (request, reply) => {
      const { exchangeId } = request.params as { exchangeId: string };
      const body = request.body;
      const payload = JSON.stringify(body);
      if (payload === '{}') {
        const req = await rpRequestCache.memoize({ key: `exchange:${exchangeId}`, fn: () => Promise.resolve(null) });
        if (!req) {
          return reply.status(404).send();
        }
        return reply.code(200).send(req);
      }
      rpResponseCache.memoize({ key: `exchange:${exchangeId}`, fn: () => Promise.resolve(body) });
      return reply.code(200).send(body);
    }
  );

  app.get(
    '/workflows/ephemeral/exchanges/:exchangeId',
    async (request, response) => {
      const { exchangeId } = request.params as any;
      const req = await rpRequestCache.memoize({ key: `exchange:${exchangeId}`, fn: () => Promise.resolve(null) });
      if (!req) {
        return response.status(404).send();
      }

      const res = await rpResponseCache.memoize({ key: `exchange:${exchangeId}`, fn: () => Promise.resolve(null) });
      if (!res) {
        return response.send({
          id: exchangeId,
          sequence: 0,
          state: 'pending',
        });
      }

      return response.send({
        id: exchangeId,
        sequence: 1,
        state: 'complete',
        response: res,
      });
    }
  );
}