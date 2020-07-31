'use strict'

class AuthLogin {
  get rules () {
    return {
      email: 'required|email',
      password: 'required'
    }
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'email.required': 'Please enter your e-mail',
      'email.email': 'Please enter a valid e-mail',
      'password.required': 'Please enter your password',
    }
  }
}

module.exports = AuthLogin
