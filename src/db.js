import mongoose from 'mongoose'

import { dbConfig } from './config/appConfig'
import logger from './logger'

const connect = () => {
  const dbUri = process.env.DB_URI
  mongoose.connect(process.env.DB_URI, dbConfig)
  mongoose.connection.once('open', () => logger.info(`DB connected: ${dbUri}`))
  mongoose.connection.on('error', err => logger.error(err))
  return mongoose
}

export const db = {
  connect: connect,
}
