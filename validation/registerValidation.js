const Validator = require('validator')
const isEmpty = require('./isEmpty')

const validateRegisterInput = (data) => {
  let errors = {}

  if (isEmpty(data.email)) {
    errors.email = 'Email field cannot be empty'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  if (isEmpty(data.name)) {
    errors.name = 'Name field cannot be empty'
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters long'
  }

  if (isEmpty(data.password)) {
    errors.password = 'Password field cannot be empty'
  } else if (!Validator.isLength(data.password, { min: 4, max: 25 })) {
    errors.password = 'Password must be between 4 and 25 characters long'
  }

  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm password field cannot be empty'
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Password and confirm password fields must match'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegisterInput