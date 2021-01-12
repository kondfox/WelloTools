import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import logger from './logger'
import * as diContainer from './diContainer'
import { api, auth, image } from './routes'
import errorHandler from './middlewares/errorHandler'
import { onStartup } from './startUp'

const dotenvFile = `.env.${process.env.NODE_ENV || 'dev'}`
dotenv.config({ path: dotenvFile })

const app = express()

diContainer.inject()

// seeds DB for demonstration puroses
onStartup(diContainer.appContext)

app.use(
  morgan('combined', {
    stream: logger.stream,
    skip: process.argv.indexOf('--silent') >= 0,
  })
)
app.use(express.static('public'))

app.use('/auth', auth(diContainer.appContext))
app.use('/api', api(diContainer.appContext))
app.use('/images', image(diContainer.appContext))

app.use(errorHandler)

export default app
