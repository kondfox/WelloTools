export const validate = (obj, objValidator) =>
  Object.entries(objValidator).reduce((errors, [field, fieldValidators]) => {
    const fieldErrors = fieldValidators
      .filter(fieldValidator => !fieldValidator.isValid(obj[field]))
      .map(failingValidator => failingValidator.errorMessage)
    if (fieldErrors.length > 0) errors[field] = fieldErrors
    return errors
  }, {})

export const validationService = {
  validate,
}
