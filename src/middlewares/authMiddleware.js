import logger from '../logger'
import { roles, errorMessages } from '../config/constants'

export const authenticate = verifyToken => async (req, res, next) => {
  try {
    req.loggedInUser = await verifyToken(req.header('Authorization'))
    logger.info('loggedInUser:', req.loggedInUser)
    next()
  } catch (err) {
    req.authError = err
    next()
  }
}

export const authOnly = (req, res, next) => {
  if (!req.loggedInUser) {
    next({
      status: 401,
      message: errorMessages.NO_AUTH,
    })
  }
  next()
}

export const adminOnly = (req, res, next) => {
  if (!req.loggedInUser || req.loggedInUser.role !== roles.ADMIN) {
    next({
      status: 403,
      message: errorMessages.NO_PERMISSION,
    })
  }
  next()
}

export const authMiddleware = authService => ({
  authenticate: authenticate(authService.verifyToken),
  authOnly,
  adminOnly,
})
