import { startApp } from './app/app'
import { PORT } from './config/env'

startApp(PORT)

process.on('uncaughtException', (err) => {
  console.trace(err)
  console.log('unhandled error after fastify error handler')
})
