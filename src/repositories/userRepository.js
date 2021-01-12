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
}

export const save = model => user =>
  new Promise((resolve, reject) => {
    model.create(user, (err, savedUser) => {
      if (err) {
        reject({ code: err.code })
        return
      }
      resolve(savedUser._id)
    })
  })

export const findOne = model => params =>
  new Promise((resolve, reject) => {
    model.findOne(params, (err, user) => {
      if (err) {
        reject({ code: err.code })
        return
      }
      resolve(user)
    })
  })

export const search = model => async (params, options) => {
  const queryOptions = {
    ...options,
    limit: options.limit || dbProps.find.limit,
  }
  try {
    const users = await model.find(params, null, queryOptions).exec()
    return Promise.resolve(users)
  } catch (err) {
    return Promise.reject({ code: err.code })
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
  }
}
