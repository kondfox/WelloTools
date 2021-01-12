import { fieldValidators } from '../config/validators'
import { validationProps, dbProps, roles } from '../config/constants'

const userValidator = {
  name: [fieldValidators.notEmpty],
  password: [fieldValidators.minLength(validationProps.MIN_PASSWORD_LENGTH)],
  email: [fieldValidators.validEmail],
}

export const hasPermission = (loggedInUser, reqId) => {
  return !(
    !loggedInUser ||
    (loggedInUser.id !== reqId && loggedInUser.role !== roles.ADMIN)
  )
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

export const defineHiddenFields = loggedInUser => {
  if (loggedInUser != undefined) {
    return ['password']
  } else {
    return ['_id', 'email', 'password', 'role']
  }
}

export const fieldsToShow = (schema, loggedInUser) => {
  const hiddenFields = defineHiddenFields(loggedInUser)
  const allowedFields = userFields(schema).filter(
    field => !hiddenFields.includes(field)
  )
  return allowedFields
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

export const search = (userRepository, filterValidFields) => async (
  loggedInUser,
  params
) => {
  const query = filterValidFields(params, userFields(userRepository.schema))
  if (query.password) delete query.password // for security reasons
  const options = constructQueryOptions(params)

  const users = await userRepository.search(query, options)

  const allowedFields = fieldsToShow(userRepository.schema, loggedInUser)

  const userDTOs = users.map(user =>
    filterValidFields(user['_doc'], allowedFields)
  )

  return Promise.resolve({
    page: params.page || 1,
    users: userDTOs,
  })
}

export const findById = (userRepository, filterValidFields) => async (
  loggedInUser,
  reqId
) => {
  const user = await userRepository.findOne({ _id: reqId })

  const allowedFields = fieldsToShow(userRepository.schema, loggedInUser)

  const userDTO = filterValidFields(user['_doc'], allowedFields)

  return Promise.resolve({
    user: userDTO,
  })
}

export const update = (userRepository, filterValidFields, encode) => async (
  loggedInUser,
  reqId,
  params
) => {
  if (!hasPermission(loggedInUser, reqId)) {
    return Promise.reject({
      status: 403,
      message: "you don't have permission, it's not your account",
    })
  }
  const validFields = filterValidFields(
    params,
    Object.keys(userRepository.schema)
  )
  if (validFields.password != undefined) {
    validFields.password = await encode(validFields.password)
  }

  return userRepository.update(reqId, validFields)
}

export const remove = userRepository => async (loggedInUser, reqId) => {
  if (!hasPermission(loggedInUser, reqId)) {
    return Promise.reject({
      status: 403,
      message: "you don't have permission, it's not your account",
    })
  }
  return userRepository.remove(reqId)
}

export const userService = (userRepository, validatationService, encoder) => ({
  register: register(userRepository, validatationService, encoder.encode),
  search: search(userRepository, validatationService.filterValidFields),
  findById: findById(userRepository, validatationService.filterValidFields),
  update: update(
    userRepository,
    validatationService.filterValidFields,
    encoder.encode
  ),
  remove: remove(userRepository),
})
