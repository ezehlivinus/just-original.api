# just-original.api
This is used for both project and talent hunting...

# Requirements
- `npm >= 7.6.2`
- `node >= 15.11.0`
- the version of `adonis use is 5.0.4 preview`
without the above requirement, the app may not work
# Setup
- clone
- install dependencies: `npm install`
- create `.env` and save it at the root of the project
- copy the content of `env.example` into `.env`
  - set it up according to your credential
  - the app has been configured prior for MySQL/MariaDb, to change this and get credential for other databases
  - do `node ace invoke @adonisjs/lucid`
    - select a database
    - choose where you want to see the default credentail and instruction: preferebaly I used terminal
    - follow the instruction for your chosen database credential
- generate api: `node ace generate:key` 
  - copy the generated string into your `.env` and make it equal to or assign it to the key: `APP_KEY`
- Set up your local or remote database
  - Run migration: `node ace migration:run`
- start the server with: `node ace serve --watch`
  - the server will start at: `localhost:3333`

# Route List

The image below will help determine routes that are authententicated or not as seen from the middleware column.

![route-list1](https://user-images.githubusercontent.com/31221649/112310003-5ac02880-8ca4-11eb-97f0-a3c45a90df69.PNG)
![route-list2](https://user-images.githubusercontent.com/31221649/112310101-775c6080-8ca4-11eb-9da1-242b239c3532.PNG)

# Resource | Routes
Users
- `localhost:3333/api/v1/users`
  - `/` method: Post Create user
  - request data
    ```
    {
      "email": "email@email.com"
      "password": "secret-password"
    }
    ```

  - response
    ```
    {
      "success": true,
      "message": "some message",
      "data": {
        "user": {*},
        "token": {*}
      }
    }
    ```

  - `/login` method: Post
    ```{ "token": "some-string "}```

  - `/logout` method: Post 
    - request Header: { "Authorization": "Bearer some-string-token-string" }
    ```
    {
      "success": true,
      "message": "logged out"
    }
    ```
Project 
- `localhost:3333/api/v1/projects`
  - Create Project: POST: `/`
  Request data:
    ```
    {

      "title": "string name",
      "url": "valid url",
      "avatar": "image file",
      "status": "any of 'Not started', 'Completed', 'Ongoing'"
      "category_id": "number id",
      "client": "string name",

    }
    ```
  - List all Project: GET: `/`
  - Retrieve a project: GET: `/id`
  - Delete a project: DELETE: `/id`
  - Update a project: PUT: `/id`
        ```
    // all or any of the following
    {
      "title": "string name",
      "url": "valid url",
      "avatar": "image file",
      "status": "any of 'Not started', 'Completed', 'Ongoing'"
      "category_id": "number id",
      "client": "string name",

    }
    ```

Talents 
- `localhost:3333/api/v1/talents`
  - Create Talent: POST: `/`
  Request data:
    ```
    {
      "name": "string name",
      "avatar": "image file",
      "category_id": "number id",
      "services": "string name",

    }
    ```
  - List all Talents: GET: `/`
  - Retrieve a Talent: GET: `/id`
  - Delete a Talent: DELETE: `/id`
  - Update a talent: PUT: `/id`
    ```
    // all or any of
    {
      "name": "string name",
      "avatar": "image file",
      "category_id": "number id",
      "services": "string name",

    }
    ```


Categories 
- `localhost:3333/api/v1/categories`
  - Create a Category: POST: `/`
  Request data:
    ```
    {
      "name": "string name",
      "description": "string name",
    }
    ```
  - List all Categories: GET: `/`
  - Retrieve a Category: GET: `/id`
  - Delete a Category: DELETE: `/id`
  - Update a Category: PUT: `/id`
    ```
    // all or any of
  
    {
      "name": "string name",
      "description": "string name",
    }
    ```


Forms (Contact Form) 
- `localhost:3333/api/v1/forms`
  - Create a Form: POST: `/`
  Request data:
    ```
    {
      "attachments": "file",
      "description": "string name",
      "duration": "string days: 2 days",
      "budget": "number"
    }
    ```
  - List all Forms: GET: `/`
  - Retrieve a Form: GET: `/id`
  - Delete a Form: DELETE: `/id`
  - Update a Form: PUT: `/id`
    ```
    // all or any of
  
    {
      "attachments": "file",
      "description": "string name",
      "duration": "string days, example 2 days",
      "budget": "number"
    }
    ```

Talent's Projects 
- `localhost:3333/api/v1/talents/talent_id/projects`
  - Create a Talent's Project: POST: `/`
  Request data:
    ```
    {
      "project_id": "number id of a project",
    }
    ```

  - Retrieve all Projects belonging to a (done by a)  talents: GET: `/`

  - Delete a Talent's Project: DELETE: `/id`
     ```
    {
      "project_id": "number id of a project",
    }
    ```

  - Update a Talent's Project: PUT: `/`
    ```
  
    {
      "project_id": "number id of a project",
    }
    ```
