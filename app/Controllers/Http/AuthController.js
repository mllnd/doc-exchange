'use strict'

const User = use('App/Models/User')
const Web3 = use('Service/Web3')

class AuthController {
  login({ request, response, view }) {
    return view.render('auth.login');
  }

  async postLogin({ request, response, auth }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return response.redirect('/dashboard')
  }

  async logout({ request, response, auth, session }) {
    await auth.logout()
    session.flash({ success_message: 'You have been logged out' })

    return response.route('AuthController.login')
  }

  register({ request, response, view }) {
    return view.render('auth.register')
  }

  async postRegister({ request, response, view, auth }) {
    // User e-mail uniqueness is validated in validation rules.
    const user = new User()
    user.fname = request.input('fname')
    user.lname = request.input('lname')
    user.email = request.input('email')
    // A User hook will perform password hashing.
    user.password = request.input('password')

    // Save the user and login.
    await user.save()
    await auth.login(user)

    return response.redirect('/dashboard')
  }

  dashboard({ request, response, view, auth }) {
    return view.render('panel.dashboard')
  }
}

module.exports = AuthController
