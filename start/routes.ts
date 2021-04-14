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
    //.middleware('auth')

  // Talents
  Route
    .group(() => {
      Route.post('/', 'TalentsController.create');
      Route.put('/:id', 'TalentsController.update');
      Route.delete('/:id', 'TalentsController.delete');

      // auth talent's project
      Route.post('/:talent_id/projects', 'TalentProjectsController.create');
      // Route.put('/:talent_id/projects', 'TalentProjectsController.update');
      Route.delete('/:talent_id/projects/:id', 'TalentProjectsController.delete');

      // Teams
      Route.post('/:talent_id/teams', 'TalentTeamsController.create');
      Route.delete('/:talent_id/teams/:id', 'TalentTeamsController.delete');

    })
    .prefix('talents')
    //.middleware('auth')

  // TalentsProjects
  Route
    .group(() => {
      Route.get('/', 'TalentsController.list');
      Route.get('/:id', 'TalentsController.retrieve');
      // return a talent together with its projects
      Route.get('/:talent_id/projects', 'TalentProjectsController.retrieve');

      // teams
      Route.get('/:talent_id/teams', 'TalentTeamsController.list');

    })
    .prefix('talents')

    // return all talents together with their projects
    // Route.get('talents-projects', 'TalentProjectsController.list');

  // Categories
  Route
    .group(() => {
      Route.post('/', 'CategoriesController.create'); //.middleware('auth');
      Route.get('/', 'CategoriesController.list');
      Route.get('/:id', 'CategoriesController.retrieve');
      Route.put('/:id', 'CategoriesController.update'); //.middleware('auth');
      Route.delete('/:id', 'CategoriesController.delete'); //.middleware('auth');
    })
    .prefix('categories')
    

  // Client
  // Route
  //   .group(() => {
  //     Route.post('/', 'ClientsController.create');
  //     Route.get('/', 'ClientsController.list');
  //     Route.get('/:id', 'ClientsController.retrieve');
  //     Route.put('/:id', 'ClientsController.update');
  //     Route.delete('/:id', 'ClientsController.delete');
  //   })
  //   .prefix('clients')
  //   .middleware('auth')

  // Forms
  Route
    .group(() => {
      Route.post('/', 'FormsController.create');
    })
    .prefix('forms')

  Route
    .group(() => {
      Route.get('/', 'FormsController.list');
      Route.get('/:id', 'FormsController.retrieve');
      Route.put('/:id', 'FormsController.update');
      Route.delete('/:id', 'FormsController.delete');
    })
    .prefix('forms')
    // .middleware('auth')

}).prefix('api/v1');
