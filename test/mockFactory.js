export const createMockEncoder = () => plainText =>
  Promise.resolve(`encoded${plainText}`)

export const createMockResponseObject = () => {
  const json = jest.fn(() => {})
  const status = jest.fn(() => ({
    json,
  }))
  return {
    json,
    status,
  }
}

export const createMockUserRepository = () => ({
  save: jest.fn(() => Promise.reject('unmocked userRepository call')),
})

export const createMockMessageFactory = () => ({
  okMessage: jest.fn(payload => ({
    status: 'ok',
    ...payload,
  })),
  errorMessage: jest.fn(message => ({
    status: 'error',
    message,
  })),
})

export const createMockUserService = () => ({
  register: jest.fn(() => Promise.reject('unmocked userService call')),
})

export const createMockValidationService = () => ({
  validate: jest.fn(() => ({})),
})
