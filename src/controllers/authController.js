export const authController = (authService, messageFactory) => ({
  login: async (req, res, next) => {
    try {
      const token = await authService.login(req.body)
      res.status(200).json(messageFactory.okMessage(token))
    } catch (err) {
      next(err)
    }
  },
})
