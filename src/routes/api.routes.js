import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

export default appContext => {
  const router = express.Router()

  router.use(cors())
  router.use(bodyParser.json())

  router.post('/users', appContext.userController.create)

  return router
}
