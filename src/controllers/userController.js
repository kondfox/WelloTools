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

  search: async (req, res, next) => {
    try {
      const users = await userService.search(req.loggedInUser, parse(req.query))
      res.status(200).json(messageFactory.okMessage({ ...users }))
    } catch (err) {
      next(err)
    }
  },

  findById: async (req, res, next) => {
    try {
      const users = await userService.findById(req.loggedInUser, {
        _id: req.params.userId,
      })
      res.status(200).json(messageFactory.okMessage({ ...users }))
    } catch (err) {
      next(err)
    }
  },

  update: async (req, res, next) => {
    try {
      await userService.update(req.loggedInUser, req.params.userId, req.body)
      res.status(200).json(messageFactory.okMessage())
    } catch (err) {
      next(err)
    }
  },

  remove: async (req, res, next) => {
    try {
      await userService.remove(req.loggedInUser, req.params.userId)
      res.status(200).json(messageFactory.okMessage())
    } catch (err) {
      next(err)
    }
  },
})
