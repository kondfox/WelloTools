import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

export default appContext => {
  const { authenticate, authOnly, adminOnly } = appContext.authMiddleware

  const router = express.Router()

  router.use(cors())
  router.use(bodyParser.json())

  router.post('/users', appContext.userController.create)

  router.use(authenticate)
  router.get('/users', appContext.userController.search)
  router.get('/users/:userId', appContext.userController.findById)

  router.use(authOnly)
  router.put('/users', appContext.userController.updateSelf)
  router.delete('/users', appContext.userController.removeSelf)

  router.use(adminOnly)
  router.put('/users/:userId', appContext.userController.updateAdmin)
  router.delete('/users/:userId', appContext.userController.removeAdmin)

  return router
}
