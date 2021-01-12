export const validationProps = {
  MIN_PASSWORD_LENGTH: 8,
}

export const tokenProps = {
  expiresIn: 3600, // 1 hour
}

export const errorCodes = {
  11000: 'email address already registered',
}

export const dbProps = {
  find: {
    limit: 10,
  },
}
