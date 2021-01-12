import express from 'express'
import cors from 'cors'
import multer from 'multer'

import { imageConfig } from '../config/appConfig'

export default appContext => {
  const router = express.Router()

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationFolder = `${imageConfig.publicFolder}/${imageConfig.uploadSrc}`
      cb(null, destinationFolder)
    },
    filename: (req, file, cb) => {
      const filenameParts = file.originalname.split('.')
      const extension = filenameParts[filenameParts.length - 1]
      const avatar = `${req.loggedInUser.id}.${extension}`
      cb(null, avatar)
    },
  })
  const imageUpload = multer({
    storage: storage,
    limits: {
      fileSize: 5242880, // 5MB
    },
  })

  router.use(cors())
  router.use(appContext.authMiddleware.authenticate)

  router.post(
    '',
    imageUpload.single('avatar'),
    appContext.imageController.upload
  )

  return router
}
