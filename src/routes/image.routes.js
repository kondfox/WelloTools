import express from 'express'
import cors from 'cors'

import { imageUpload } from '../config/imageConfig'

export default appContext => {
  const router = express.Router()

  router.use(cors())
  router.use(appContext.authMiddleware.authenticate)

  router.post(
    '/avatar',
    imageUpload.single('avatar'),
    appContext.imageController.upload
  )

  return router
}
