export const findValidationErrors = (obj, objValidator) =>
  Object.entries(objValidator).reduce((errors, [field, fieldValidators]) => {
    const fieldErrors = fieldValidators
      .filter(fieldValidator => !fieldValidator.isValid(obj[field]))
      .map(failingValidator => failingValidator.errorMessage)
    if (fieldErrors.length > 0) errors[field] = fieldErrors
    return errors
  }, {})

export const validate = (obj, objValidator) => {
  const validationErrors = findValidationErrors(obj, objValidator)

  if (Object.keys(validationErrors).length) {
    return Promise.reject({
      status: 400,
      message: 'validation error',
      details: validationErrors,
    })
  }

  return Promise.resolve()
}

export const filterValidFields = (obj, validFields = []) => {
  return Object.fromEntries(
    Object.keys(obj)
      .filter(field => validFields.includes(field))
      .map(field => [field, obj[field]])
  )
}

export const validationService = {
  validate,
  filterValidFields,
}
