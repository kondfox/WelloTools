import logger from '../logger'

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

export const find = model => params =>
  new Promise((resolve, reject) => {
    model.create(user, (err, savedUser) => {
      if (err) {
        logger.error(err)
        reject(err)
        return
      }
      resolve(savedUser._id)
    })
  })

export const remove = model => conditions => model.remove(conditions)

export const userRepository = db => {
  const userSchema = new db.Schema(schema)
  const userModel = db.model('User', userSchema)
  return {
    save: save(userModel),
    remove: remove(userModel),
  }
}
