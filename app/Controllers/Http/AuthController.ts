import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import _ from 'lodash'

export default class AuthController {
  public async create ({ request, auth, response }: HttpContextContract) {
    // 

    const _user = await User.findBy('email', request.input('email'))

    if (!(_.isEmpty(_user))) {
      return { success: false, message: 'user already exist' }
    }

    const validationSchema = schema.create({

      email: schema.string({ trim: true}, [
        rules.email(),
        // rules.unique({ table: 'users', column: 'email' }),
      ]),

      password: schema.string({}, [
        rules.required(),
        rules.minLength(6)
      ]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
    })

    const user = await User.create(validatedData)

    // login using user instance
    const token = await auth.use('api').login(user, {
      expiresIn: '7 days',
    })

    return {success: true, message: 'creation success', data: { user, token }}
  }

  public async login ({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '7 days',
    })
    return token;
  }

  public async logout ({ auth }: HttpContextContract) {
    await auth.authenticate()
    await auth.use('api').logout()

    return {
      success: true,
      message: 'logged out'
    }
  }
}
