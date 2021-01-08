import { validator, fieldValidators } from '../../src/config/validators'

describe('validator', () => {
  it('should create an object from the given params', () => {
    const isValid = jest.fn()
    const errorMessage = 'error'
    const expected = { isValid, errorMessage }

    const actual = validator(isValid, errorMessage)

    expect(actual).toEqual(expected)
  })

  it('should not create object with different params than the given ones', () => {
    const isValid = jest.fn()
    const errorMessage = 'error'
    const expected = { isValid, errorMessage }

    const actual = validator(jest.fn(), 'message')

    expect(actual).not.toEqual(expected)
  })
})

describe('fieldValidators', () => {
  const { notEmpty, minLength, validEmail } = fieldValidators

  describe('notEmpty.isValid', () => {
    it('should return true if the input string has length', () => {
      expect(notEmpty.isValid('apple')).toBeTruthy()
    })

    it('should return false if the input string is an empty', () => {
      expect(notEmpty.isValid('')).toBeFalsy()
    })

    it('should return false if the input is undefined', () => {
      expect(notEmpty.isValid()).toBeFalsy()
    })
  })

  describe('minLength.isValid', () => {
    it('should return true if the input string has bigger or equal length than the given limit', () => {
      expect(minLength(5).isValid('apple')).toBeTruthy()
    })

    it('should return false if the input string has smaller length than the given limit', () => {
      expect(minLength(6).isValid('apple')).toBeFalsy()
    })
  })

  describe('validEmail.isValid', () => {
    it('should return true if the input string is a valid email address', () => {
      expect(validEmail.isValid('email@domain.com')).toBeTruthy()
    })

    it('should return false if the input string is an invalid email address', () => {
      expect(validEmail.isValid('email')).toBeFalsy()
    })
  })
})
