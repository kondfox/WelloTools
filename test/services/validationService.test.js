import { validationService } from '../../src/services/validationService'

const notEmptyErrorMessage = 'should not be empty'
const notEmptyValidator = {
  isValid: p => p && p.length > 0,
  errorMessage: notEmptyErrorMessage,
}

const minLengthErrorMessage = 'too short'
const minLengthValidator = {
  isValid: p => p && p.length > 2,
  errorMessage: minLengthErrorMessage,
}

describe('validationService', () => {
  describe('validate', () => {
    it('should return validation error when 1 fieldValidator fails', async () => {
      const obj = { field: '' }
      const validator = { field: [notEmptyValidator] }
      const expectedResult = {
        status: 400,
        message: 'validation error',
        details: {
          field: [notEmptyErrorMessage],
        },
      }

      await expect(
        validationService.validate(obj, validator)
      ).rejects.toStrictEqual(expectedResult)
    })

    it('should return validation errors when more fieldValidator fails', async () => {
      const obj = { field: '' }
      const validator = { field: [notEmptyValidator, minLengthValidator] }
      const expectedResult = {
        status: 400,
        message: 'validation error',
        details: {
          field: [notEmptyErrorMessage, minLengthErrorMessage],
        },
      }

      await expect(
        validationService.validate(obj, validator)
      ).rejects.toStrictEqual(expectedResult)
    })

    it('should return validation errors when multiple fields fail', async () => {
      const obj = { field: '', otherField: 'a' }
      const validator = {
        field: [minLengthValidator],
        otherField: [minLengthValidator],
      }
      const expectedError = {
        status: 400,
        message: 'validation error',
        details: {
          field: [minLengthErrorMessage],
          otherField: [minLengthErrorMessage],
        },
      }

      await expect(
        validationService.validate(obj, validator)
      ).rejects.toStrictEqual(expectedError)
    })

    it('should return only invalid fields when validation errors', async () => {
      const obj = { field: 'a', otherField: '' }
      const validator = {
        field: [notEmptyValidator],
        otherField: [notEmptyValidator],
      }
      const expectedError = {
        status: 400,
        message: 'validation error',
        details: { otherField: [notEmptyErrorMessage] },
      }

      await expect(
        validationService.validate(obj, validator)
      ).rejects.toStrictEqual(expectedError)
    })

    it('should resolve when valid object given', async () => {
      const obj = { field: 'a' }
      const validator = { field: [notEmptyValidator] }

      await expect(validationService.validate(obj, validator))
    })
  })
})
