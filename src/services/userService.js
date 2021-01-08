import { fieldValidators } from '../config/validators'
import { validationProps } from '../config/constants'

const userValidator = {
  name: [fieldValidators.notEmpty],
  password: [fieldValidators.minLength(validationProps.MIN_PASSWORD_LENGTH)],
  email: [fieldValidators.validEmail],
}

export const encodePassword = async (encoder, user) => ({
  ...user,
  password: await encoder(user.password),
})

export const register = (
  userRepository,
  validatationService,
  encoder
) => async user => {
  const validationErrors = validatationService.validate(user, userValidator)
  if (Object.keys(validationErrors).length)
    return Promise.reject({
      status: 400,
      message: 'validation error',
      details: validationErrors,
    })

  user = await encodePassword(encoder, user)

  return userRepository.save(user)
}

export const login = (
  userRepository,
  validatationService,
  encoder
) => async credentials => {}

export const userService = (userRepository, validatationService, encoder) => ({
  register: register(userRepository, validatationService, encoder),
  login: login(userRepository, validatationService, encoder),
})
