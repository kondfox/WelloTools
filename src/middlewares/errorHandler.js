import logger from '../logger'
import { messageFactory } from '../factories'
import { errorCodes } from '../config/constants'

export default (err, req, res, next) => {
  logger.error(`${req.ip} - ${req.method} - ${req.originalUrl}\n`, err)

  const { message, details } = err
  const errorMessageDetails = {
    message: message || 'unkown error',
  }
  if (err.code) errorMessageDetails['message'] = errorCodes[err.code]
  if (details != undefined) errorMessageDetails['details'] = details

  res.status(err.status || 500)
  res.json(messageFactory.errorMessage(errorMessageDetails))
  next()
}
