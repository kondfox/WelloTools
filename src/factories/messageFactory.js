export const okMessage = payload => ({
  status: 'ok',
  ...payload,
})

export const errorMessage = params => ({
  status: 'error',
  ...params,
})

export const messageFactory = {
  okMessage,
  errorMessage,
}
