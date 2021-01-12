import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

export default appContext => {
  const router = express.Router()

  router.use(cors())
  router.use(bodyParser.json())

  router.post('/users', appContext.userController.create)
  router.get('/users', appContext.userController.search)
  router.get('/users/:userId', appContext.userController.findById)
  router.put('/users/:userId', appContext.userController.update)
  router.delete('/users/:userId', appContext.userController.remove)

  return router
}
