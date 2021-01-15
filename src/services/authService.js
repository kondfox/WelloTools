import { sign, verify } from 'jsonwebtoken'

import { fieldValidators } from '../config/validators'
import { validationProps, tokenProps, tokenPrefix } from '../config/constants'

export const generateToken = user => {
  return sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.TOKEN_SECRET,
    tokenProps
  )
}

export const verifyToken = token => {
  if (!token || !token.startsWith(tokenPrefix))
    return Promise.reject({
      status: 401,
      message: 'no bearer token provided',
    })

  try {
    const jwtToken = token.split(' ')[1]
    const { id, role } = verify(jwtToken, process.env.TOKEN_SECRET)
    return Promise.resolve({ id, role })
  } catch (err) {
    return Promise.reject({
      status: 401,
      message: 'invalid token',
    })
  }
}

export const credentialValidator = {
  password: [fieldValidators.minLength(validationProps.MIN_PASSWORD_LENGTH)],
  email: [fieldValidators.validEmail],
}

export const login = (
  userRepository,
  validate,
  compare
) => async credentials => {
  await validate(credentials, credentialValidator)
  const user = await userRepository.findOne({ email: credentials.email })
  const isValidPassword = await compare(credentials.password, user.password)

  if (!isValidPassword) {
    return Promise.reject({
      status: 400,
      message: 'wrong email or password',
    })
  }

  const token = generateToken(user)
  return Promise.resolve({ token })
}

export const authService = (userRepository, validatationService, encoder) => ({
  login: login(userRepository, validatationService.validate, encoder.compare),
  verifyToken,
})
