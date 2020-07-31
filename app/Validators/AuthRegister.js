'use strict'

class AuthRegister {
  get rules () {
    return {
      fname: 'required',
      lname: 'required',
      email: 'required|email|unique:users',
      password: 'required|min:8|confirmed',
    }
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'fname.required': 'Please enter your firstname',
      'lname.required': 'Please enter your lastname',
      'email.required': 'Please enter your e-mail',
      'email.email': 'Please enter a valid e-mail',
      'email.unique': 'This email is already registered',
      'password.required': 'Please enter your password',
      'password.min': 'Your password must be at least 8 characters',
      'password.confirmed': 'Your passwords do not match'
    }
  }
}

module.exports = AuthRegister
