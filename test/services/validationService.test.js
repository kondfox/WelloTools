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
    it('should return validation error when 1 fieldValidator fails', () => {
      const obj = { field: '' }
      const validator = { field: [notEmptyValidator] }
      const expectedResult = { field: [notEmptyErrorMessage] }

      const result = validationService.validate(obj, validator)

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return validation errors when more fieldValidator fails', () => {
      const obj = { field: '' }
      const validator = { field: [notEmptyValidator, minLengthValidator] }
      const expectedResult = {
        field: [notEmptyErrorMessage, minLengthErrorMessage],
      }

      const result = validationService.validate(obj, validator)

      expect(result).toStrictEqual(expectedResult)
    })

    it('should return validation errors when multiple fields fail', () => {
      const obj = { field: '', otherField: 'a' }
      const validator = {
        field: [minLengthValidator],
        otherField: [minLengthValidator],
      }

      const result = validationService.validate(obj, validator)

      expect(result.field).not.toBeUndefined()
      expect(result.otherField).not.toBeUndefined()
    })

    it('should return empty object when obj contain valid and invalid fields', () => {
      const obj = { field: 'a', otherField: '' }
      const validator = {
        field: [notEmptyValidator],
        otherField: [notEmptyValidator],
      }

      const result = validationService.validate(obj, validator)

      expect(result.field).toBeUndefined()
      expect(result.otherField).not.toBeUndefined()
    })

    it('should return only invalid fields when validation errors', () => {
      const obj = { field: 'a' }
      const validator = { field: [notEmptyValidator] }

      const result = validationService.validate(obj, validator)

      expect(result).toStrictEqual({})
    })
  })
})
