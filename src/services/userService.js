import { sign } from 'jsonwebtoken'

import { fieldValidators } from '../config/validators'
import { validationProps, tokenProps } from '../config/constants'

const userValidator = {
  name: [fieldValidators.notEmpty],
  password: [fieldValidators.minLength(validationProps.MIN_PASSWORD_LENGTH)],
  email: [fieldValidators.validEmail],
}

const credentialValidator = {
  password: [fieldValidators.minLength(validationProps.MIN_PASSWORD_LENGTH)],
  email: [fieldValidators.validEmail],
}

export const encodePassword = async (encode, user) => ({
  ...user,
  password: await encode(user.password),
})

export const register = (
  userRepository,
  validatationService,
  encode
) => async user => {
  await validatationService.validate(user, userValidator)

  user = await encodePassword(encode, user)

  return userRepository.save(user)
}

export const login = (
  userRepository,
  validatationService,
  compare
) => async credentials => {
  await validatationService.validate(credentials, credentialValidator)
  const user = await userRepository.findOne({ email: credentials.email })

  const isValidPassword = await compare(credentials.password, user.password)

  if (!isValidPassword) {
    return Promise.reject({
      status: 400,
      message: 'wrong username or password',
    })
  }

  const token = sign({ userId: user.id }, process.env.TOKEN_SECRET, tokenProps)
  return Promise.resolve({ token })
}

export const userService = (userRepository, validatationService, encoder) => ({
  register: register(userRepository, validatationService, encoder.encode),
  login: login(userRepository, validatationService, encoder.compare),
})
