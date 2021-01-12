import { db } from './db'
import * as appConfig from './config/appConfig'
import * as controllers from './controllers'
import * as services from './services'
import * as factories from './factories'
import * as repositories from './repositories'
import * as middlewares from './middlewares'

export const appContext = {
  encoder: {},
  userRepository: {},
  messageFactory: {},
  validatationService: {},
  userService: {},
  authService: {},
  userController: {},
  authController: {},
  authMiddleware: {},
}

const injectCustomDependencies = (dependencies = {}) => {
  Object.entries(dependencies).forEach(
    ([dependency, implementation]) => (appContext[dependency] = implementation)
  )
}

const injectDefaultDependencies = () => {
  const dbConnection = db.connect()
  const encoder = appConfig.encoder
  const userRepository = repositories.userRepository(dbConnection)
  const messageFactory = factories.messageFactory
  const validationService = services.validationService
  const authService = services.authService(
    userRepository,
    validationService,
    encoder
  )
  const userService = services.userService(
    userRepository,
    validationService,
    encoder
  )
  const userController = controllers.userController(userService, messageFactory)
  const authController = controllers.authController(authService, messageFactory)
  const authMiddleware = middlewares.authMiddleware(authService)

  injectCustomDependencies({
    encoder,
    userRepository,
    messageFactory,
    validationService,
    userService,
    authService,
    userController,
    authController,
    authMiddleware,
  })
}

export const inject = dependencies => {
  injectDefaultDependencies()
  injectCustomDependencies(dependencies)
  return appContext
}
