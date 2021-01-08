import emailValidator from 'email-validator'

export const validator = (isValid, errorMessage) => ({
  isValid,
  errorMessage,
})

export const fieldValidators = {
  notEmpty: validator(s => s && s.length > 0, `shouldn't be empty`),
  minLength: length =>
    validator(p => p && p.length >= length, `should be minimum ${length} long`),
  validEmail: validator(
    e => e && emailValidator.validate(e),
    `invalid email format`
  ),
}
