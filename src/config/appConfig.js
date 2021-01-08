import bcrypt from 'bcrypt'

export const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

export const encoderConfig = {
  saltRounds: 10,
}

export const encoder = plainText =>
  bcrypt.hash(plainText, encoderConfig.saltRounds)
