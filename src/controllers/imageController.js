import { imageConfig } from '../config/appConfig'

export const imageController = (userService, messageFactory) => ({
  upload: async (req, res, next) => {
    try {
      const avatarPath = `${req.protocol}://${req.headers.host}/${imageConfig.uploadSrc}`
      const avatar = `${avatarPath}/${req.file.filename}`
      await userService.update(req.loggedInUser.id, { avatar }, false)
      res.status(201).json(messageFactory.okMessage({ avatar }))
    } catch (err) {
      next(err)
    }
  },
})
