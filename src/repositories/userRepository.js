import { dbProps } from '../config/constants'

const schema = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  role: {
    type: String,
  },
  avatar: {
    type: String,
  },
}

const errorWithoutCode = err => {
  if (err.message.indexOf('Cast to ') > -1) {
    let field = err.message.split(' ')[2]
    if (field === 'ObjectId') field = 'userId'
    return {
      status: 400,
      message: `invalid ${field} is given`,
    }
  }
  return err
}

export const noSuchUserError = {
  status: 404,
  message: 'no such user found',
}

export const handleError = err => {
  const codelessError = errorWithoutCode(err)
  if (codelessError.status != undefined) {
    return Promise.reject(codelessError)
  } else {
    return Promise.reject({ code: err.code })
  }
}

export const save = model => async user => {
  try {
    const savedUser = await model.create(user)
    return Promise.resolve(savedUser._id)
  } catch (err) {
    return handleError(err)
  }
}

export const findOne = model => async params => {
  try {
    const user = await model.findOne(params)
    if (!user) return Promise.reject(noSuchUserError)
    return Promise.resolve(user)
  } catch (err) {
    return handleError(err)
  }
}

export const search = model => async (params, options) => {
  const queryOptions = {
    ...options,
    limit: options.limit || dbProps.find.limit,
  }
  try {
    const users = await model.find(params, null, queryOptions)
    return Promise.resolve(users)
  } catch (err) {
    return handleError(err)
  }
}

export const update = model => async (id, update) => {
  try {
    const user = await model.findByIdAndUpdate(id, update)
    if (!user) return Promise.reject(noSuchUserError)
    return Promise.resolve()
  } catch (err) {
    return handleError(err)
  }
}

export const remove = model => async id => {
  try {
    const user = await model.findByIdAndRemove(id)
    if (!user) return Promise.reject(noSuchUserError)
    return Promise.resolve()
  } catch (err) {
    return handleError(err)
  }
}

export const userRepository = db => {
  const userSchema = new db.Schema(schema)
  const userModel = db.model('User', userSchema)
  return {
    schema,
    save: save(userModel),
    findOne: findOne(userModel),
    search: search(userModel),
    update: update(userModel),
    remove: remove(userModel),
  }
}
