'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

// Auth routes
Route.group(() => {
    Route.get('login', 'AuthController.login')
    Route.post('login', 'AuthController.postLogin').validator('AuthLogin')
    Route.get('register', 'AuthController.register')
    Route.post('register', 'AuthController.postRegister').validator('AuthRegister')
}).prefix('auth').middleware('guest')

// Authenticated
Route.group(() => {
    Route.post('logout', 'AuthController.logout')
    Route.get('dashboard', 'AuthController.dashboard')
}).middleware(['authRedirect','auth:session'])

Route.get('/users', 'UserController.index')
