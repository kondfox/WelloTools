import { db } from './db'
import * as appConfig from './config/appConfig'
import * as controllers from './controllers'
import * as services from './services'
import * as factories from './factories'
import * as repositories from './repositories'

export const appContext = {
  encoder: {},
  userRepository: {},
  messageFactory: {},
  validatationService: {},
  userService: {},
  userController: {},
  authController: {},
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
  const userService = services.userService(
    userRepository,
    validationService,
    encoder
  )
  const userController = controllers.userController(userService, messageFactory)
  const authController = controllers.authController(userService, messageFactory)

  injectCustomDependencies({
    encoder,
    userRepository,
    messageFactory,
    validationService,
    userService,
    userController,
    authController,
  })
}

export const inject = dependencies => {
  injectDefaultDependencies()
  injectCustomDependencies(dependencies)
  return appContext
}
