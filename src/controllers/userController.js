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

  updateSelf: async (req, res, next) => {
    try {
      await userService.update(req.loggedInUser.id, req.body, false)
      res.status(200).json(messageFactory.okMessage())
    } catch (err) {
      next(err)
    }
  },

  updateAdmin: async (req, res, next) => {
    try {
      await userService.update(req.params.userId, req.body, true)
      res.status(200).json(messageFactory.okMessage())
    } catch (err) {
      next(err)
    }
  },

  removeSelf: async (req, res, next) => {
    try {
      await userService.remove(req.loggedInUser.id)
      res.status(200).json(messageFactory.okMessage())
    } catch (err) {
      next(err)
    }
  },

  removeAdmin: async (req, res, next) => {
    try {
      await userService.remove(req.params.userId)
      res.status(200).json(messageFactory.okMessage())
    } catch (err) {
      next(err)
    }
  },
})
