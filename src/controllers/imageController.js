import { imageConfig } from '../config/appConfig'

export const imageController = (userService, messageFactory) => ({
  upload: async (req, res, next) => {
    try {
      const avatarPath = `${req.protocol}://${req.headers.host}/${imageConfig.uploadSrc}`
      await userService.update(req.loggedInUser, req.loggedInUser.id, {
        avatar: `${avatarPath}/${req.file.filename}`,
      })
      res.json(messageFactory.okMessage())
    } catch (err) {
      next(err)
    }
  },
})
