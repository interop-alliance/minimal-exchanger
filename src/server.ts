import Fastify from 'fastify'
import cors from '@fastify/cors'
import { initExchangeRoutes } from './routes/exchanges'
import { PORT, HOST } from './config.default'


export async function createServer() {
  const app = Fastify({ logger: true })

  await app.register(cors, { origin: '*' })

  await app.register(initExchangeRoutes)

  return app
}

async function start() {
  try {
    const app = await createServer()
    const address = await app.listen({ port: +PORT, host: HOST })

    console.log(`Running on: ${address}`)
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
