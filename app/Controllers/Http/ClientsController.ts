import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Client from 'App/Models/Client'
import _ from 'lodash'
import Application from '@ioc:Adonis/Core/Application'
import cloudinary from '../../../config/cloudinary'



export default class ClientsController {
  
  /**
   * @description list all clients
   */
   public async list({ response, logger }: HttpContextContract) {

    try {

      const clients = await Client.all()

      if (_.isEmpty(clients)) {
        return response.status(404).send({
          success: false, message: 'clients not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'clients list',
        data: clients
      })

    } catch(error) {
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error,
      })
    }
  }

    /**
   * create a client
   */
     public async create({ request, auth, response, logger }: HttpContextContract) {

      const user = await auth.authenticate();

      try {
        const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
        })

        if (!avatar) {
        return response.status(400).send({
            success: false,
            message: 'Please upload file'
        })
        }

        if (avatar.hasErrors) {
        return response.status(400).send({
            success: false,
            message: avatar.errors[0].message
        })
        }
        
        await avatar.move(Application.tmpPath('uploads'), {
        name: `${new Date().getTime()}.${avatar.extname}`,
        })

        const { cResponse, success } = await cloudinary.uploadImage(avatar.filePath);

        if (!success) return response.status(500).send({
        success, cResponse
        })


        const clientSchema = schema.create({
          name: schema.string({ trim: true}),
          bio: schema.string({ trim: true}),
          business_type: schema.string({ trim: true})
        })
  
        const validatedData = await request.validate({
          schema: clientSchema,
        })
  
        const clientData = {
          businessType: validatedData.business_type,
          bio: validatedData.bio,
          name: validatedData.name,
          avatar: cResponse.secure_url,
          creator: user.id
        }
  
      // handle create new client
        try {
          const client = await Client.create(clientData)
  
          return response.status(201).send({
            success: true,
            message: 'client created',
            data: client
          });
        } catch (error) {
          logger.error(error)
          return response.status(500).send({
            success: false,
            message: 'failed creating new client',
            hint: error
          })
        }
  
      } catch (error) {
        logger.error(error)
        return response.status(400).send({
          success: false,
          message: error.message,
          hint: error
        })
      }
    }

      /**
   * retrieve a single client
   */
   public async retrieve({ response, logger, params }: HttpContextContract) {
    try {

      const client = await Client.find(params.id)

      if (_.isEmpty(client)) {
        return response.status(401).send({
          success: false, message: 'client not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'client retrieved',
        data: client
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.message,
        hint: error
      })
    }
   }

  /**
   * update a single client
   */
  public async update({ request, response, logger, params }: HttpContextContract) {

    try {

      const client = await Client.find(params.id)

      if (_.isEmpty(client)) {
        return response.status(404).send({
          success: false, message: 'client not found'
        })
      }

      const avatar = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      let _cResponse: any;

      if (avatar) {
        if (avatar.hasErrors) {
          return response.status(400).send({
            success: false,
            message: avatar.errors[0].message
          })
        }

        await avatar.move(Application.tmpPath('uploads'), {
          name: `${new Date().getTime()}.${avatar.extname}`,
        })

        const { cResponse, success } = await cloudinary.uploadImage(avatar.filePath);
  
      if (!success) return response.status(500).send({
        success, cResponse
      })

      _cResponse = cResponse.secure_url;
      }

      client.avatar = _cResponse === undefined || null ? client.avatar : _cResponse

      const validationSchema = schema.create({
        name: schema.string({ trim: true}),
        bio: schema.string({ trim: true}),
        business_type: schema.string({ trim: true})
      })
  
      const validatedData = await request.validate({
        schema: validationSchema,
      })

      client.name = validatedData.name;
      client.bio = validatedData.bio;
      client.businessType = validatedData.business_type;
      
      await client?.save();

      return response.status(200).send({
        success: true,
        message: 'client updated',
        data: client
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.message,
        hint: error
      })
    }
  }

  /**
   * delete a single client
   */
   public async delete({ request, response, logger, params }: HttpContextContract) {

    try {

      const client = await Client.find(params.id)

      if (_.isEmpty(client)) {
        return response.status(401).send({
          success: false, message: 'client not found'
        })
      }

      await client.delete()

      return response.status(200).send({
        success: true,
        message: 'client deleted',
        data: client
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.message,
        hint: error
      })
    }

  }

}
