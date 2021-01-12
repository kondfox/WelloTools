import bcrypt from 'bcrypt'

export const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

export const encoderConfig = {
  saltRounds: 10,
}

export const encoder = {
  encode: plainText => bcrypt.hash(plainText, encoderConfig.saltRounds),
  compare: (plainText, hash) => bcrypt.compare(plainText, hash),
}

export const imageConfig = {
  publicFolder: 'public',
  uploadSrc: 'profilepics',
}
