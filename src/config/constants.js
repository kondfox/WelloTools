export const validationProps = {
  MIN_PASSWORD_LENGTH: 8,
}

export const tokenProps = {
  expiresIn: 3600, // 1 hour
}

export const tokenPrefix = 'Bearer '

export const errorMessages = {
  NO_AUTH: 'no valid token found',
  NO_PERMISSION: "you don't have permission",
}

export const errorCodes = {
  11000: {
    status: 409,
    message: 'email address already registered',
  },
}

export const dbProps = {
  find: {
    limit: 10,
  },
}

export const roles = {
  ADMIN: 'ADMIN',
}
