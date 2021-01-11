export const authController = (userService, messageFactory) => ({
  login: async (req, res, next) => {
    try {
      const token = await userService.login(req.body)
      res.status(200).json(messageFactory.okMessage(token))
    } catch (err) {
      next(err)
    }
  },
})
