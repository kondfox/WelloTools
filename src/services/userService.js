import { sign } from 'jsonwebtoken'

import { fieldValidators } from '../config/validators'
import { validationProps, tokenProps, dbProps } from '../config/constants'
import { userRepository } from '../repositories/userRepository'

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

export const userFields = userSchema => ['_id', ...Object.keys(userSchema)]

export const constructQueryOptions = params => {
  const options = {}
  if (params.page != undefined && params.page > 0) {
    options.skip = (Number(params.page) - 1) * dbProps.find.limit
  }
  return options
}

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

export const find = (userRepository, filterValidFields) => async params => {
  const query = filterValidFields(params, userFields(userRepository.schema))
  if (query.password) delete query.password // for security reasons
  const options = constructQueryOptions(params)

  const users = await userRepository.find(query, options)

  const hiddenFields = ['password']
  const validFields = userFields(userRepository.schema).filter(
    field => !hiddenFields.includes(field)
  )

  const userDTOs = users.map(user =>
    filterValidFields(user['_doc'], validFields)
  )

  return Promise.resolve({
    page: params.page || 1,
    users: userDTOs,
  })
}

export const userService = (userRepository, validatationService, encoder) => ({
  register: register(userRepository, validatationService, encoder.encode),
  login: login(userRepository, validatationService, encoder.compare),
  find: find(userRepository, validatationService.filterValidFields),
})
