# adonisjs-template
This is a boiler plate for building nodejs/adonisjs api

# Requirements
- `npm >= 7.6.2`
- `node >= 15.11.0`
- the version of `adonis use is 5.0.4 preview`
without the above requirement, the app may not work
# Setup
- clone
- create `.env`
- copy the content of `env.example` into `.env`
  - set it up according to you credential
` install dependencies: `npm install`
- Run the app with: `node ace serve --watch`
  - the server will start at: `localhost:3333`


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
    - request Header: { "Application": "Bearer some-string-token-string" }
    ```
    {
      "success": true,
      "message": "logged out"
    }
    ```
