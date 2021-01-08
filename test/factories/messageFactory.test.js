import { messageFactory } from '../../src/factories'

describe('messageFactory', () => {
  describe('okMessage', () => {
    it('should have "ok" status', () => {
      const okMessage = messageFactory.okMessage('')

      expect(okMessage).not.toBeNull()
      expect(okMessage.status).toBe('ok')
    })

    it('should add the fields and values of the given payload to the message', () => {
      const okMessage = messageFactory.okMessage({
        field: 'field',
        otherField: 'otherField',
      })

      expect(okMessage).not.toBeNull()
      expect(okMessage.field).toBe('field')
      expect(okMessage.otherField).toBe('otherField')
    })
  })

  describe('errorMessage', () => {
    it('should have "error" status', () => {
      const errorMessage = messageFactory.errorMessage('')

      expect(errorMessage).not.toBeNull()
      expect(errorMessage.status).toBe('error')
    })

    it('should add the given params to the message', () => {
      const message = 'oops'
      const details = { length: 5 }
      const errorMessage = messageFactory.errorMessage({ message, details })

      expect(errorMessage).not.toBeNull()
      expect(errorMessage.message).toBe(message)
      expect(errorMessage.details).toBe(details)
    })
  })
})
