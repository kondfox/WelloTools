import { parse } from 'qs'

export const userController = (userService, messageFactory) => ({
  create: async (req, res, next) => {
    try {
      const userId = await userService.register(req.body)
      res.status(201).json(messageFactory.okMessage({ userId }))
    } catch (err) {
      next(err)
    }
  },

  find: async (req, res, next) => {
    try {
      const users = await userService.find(parse(req.query))
      res.status(200).json(messageFactory.okMessage({ ...users }))
    } catch (err) {
      next(err)
    }
  },
})
