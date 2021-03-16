/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  // Users
  Route
    .group(() => {
      Route.post('/', 'AuthController.create');
      Route.post('/login', 'AuthController.login');
      Route.post('/logout', 'AuthController.logout');
    })
    .prefix('users')

  // Projects

  // unprotected
  Route
    .group(() => {
      Route.get('/', 'ProjectsController.list');
      Route.get('/:id', 'ProjectsController.retrieve');
    })
    .prefix('projects')
  // protected
  Route
    .group(() => {
      Route.post('/', 'ProjectsController.create');
      Route.put('/:id', 'ProjectsController.update');
      Route.delete('/:id', 'ProjectsController.delete');
    })
    .prefix('projects')
    .middleware('auth')

}).prefix('api/v1');
