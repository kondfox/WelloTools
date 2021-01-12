export const authenticate = verifyToken => async (req, res, next) => {
  try {
    req.loggedInUser = await verifyToken(req.header('Authorization'))
    next()
  } catch (err) {
    req.authError = err
    next()
  }
}

export const authMiddleware = authService => ({
  authenticate: authenticate(authService.verifyToken),
})
