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
        message: error.message,
      })
    }
  }

    /**
   * create a client
   */
     public async create({ request, auth, response, logger }: HttpContextContract) {
    
      try {
        const user = await auth.authenticate();
  
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
  
        const cResponse = await cloudinary.uploadImage(avatar.filePath);
    
        const clientSchema = schema.create({
          name: schema.string({ trim: true}),
          url: schema.string({ trim: true}, [
            rules.url()
          ]),
          service_required: schema.string({ trim: true}),
          service_type: schema.string({ trim: true})
        })
  
        const validatedData = await request.validate({
          schema: clientSchema,
        })
  
        const clientData = {
          serviceRequired: validatedData.service_required,
          serviceType: validatedData.service_required,
          url: validatedData.url,
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
            message: 'failed creating new client'
          })
        }
  
      } catch (error) {
        logger.error(error)
        return response.status(400).send({
          success: false,
          message: error.message
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

      let cResponse: any;

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
  
        cResponse = await cloudinary.uploadImage(avatar.filePath);
        client.avatar = cResponse.secure_url;
      }

      const validationSchema = schema.create({

        name: schema.string({ trim: true}),
        service_type: schema.string({ trim: true}),
        service_required: schema.string({ trim: true}),
        url: schema.string({ trim: true}, [
          rules.url()
        ])
      })
  
      const validatedData = await request.validate({
        schema: validationSchema,
      })

      client.name = validatedData.name;
      client.url = validatedData.url;
      client.serviceType = validatedData.service_type;
      client.serviceRequired = validatedData.service_required;

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
      })
    }

  }

}
