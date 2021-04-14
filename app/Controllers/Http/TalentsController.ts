import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Talent from 'App/Models/Talent'
import _ from 'lodash'
import Application from '@ioc:Adonis/Core/Application'
import cloudinary from '../../../config/cloudinary'
import { schema, rules } from '@ioc:Adonis/Core/Validator'



export default class TalentsController {

  /**
   * @description list all talents
   */
  public async list({ response, logger }: HttpContextContract) {
    try {

      const talents = await Talent.all()

      if (_.isEmpty(talents)) {
        return response.status(404).send({
          success: false, message: 'talents not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'talents list',
        data: talents
      })

    } catch(error) {
      logger.error(error);
      return response.status(401).send({
        success: true,
        message: error.message,
      })
    }
  }

  /**
   * create a talent
   */
   public async create({ request, auth, response, logger }: HttpContextContract) {
    
    try {
      // const user = await auth.authenticate();

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

      const talentSchema = schema.create({
        name: schema.string({ trim: true}),
        services: schema.string({ trim: true}),
        category_id: schema.number()
      })

      const validatedData = await request.validate({
        schema: talentSchema,
      })

      const talentData = {
        ..._.omit(validatedData, ['category_id']),
        categoryId: validatedData.category_id,
        avatar: cResponse.secure_url,
        creator: 1 // user.id
      }

    // handle create new talent
      try {
        const talent = await Talent.create(talentData)

        return response.status(201).send({
          success: true,
          message: 'talent created',
          data: talent
        });
      } catch (error) {
        logger.error(error)
        return response.status(500).send({
          success: false,
          message: 'failed creating new talent',
          hint: error
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
   * retrieve a single talent
   */
   public async retrieve({ response, logger, params }: HttpContextContract) {
    try {

      const talent = await Talent.find(params.id)

      if (_.isEmpty(talent)) {
        return response.status(401).send({
          success: false, message: 'talent not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'talent retrieved',
        data: talent
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: true,
        message: error.message,
      })
    }
   }

   
  /**
   * update a single talent
   */
   public async update({ request, response, logger, params }: HttpContextContract) {
    try {

      const talent = await Talent.find(params.id)

      if (_.isEmpty(talent)) {
        return response.status(404).send({
          success: false, message: 'talent not found'
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

        const { cResponse, success } = await cloudinary.uploadImage(avatar.filePath);
  
      if (!success) return response.status(500).send({
        success, cResponse
      })

        talent.avatar = cResponse.secure_url;
      }

      const validationSchema = schema.create({

        name: schema.string.optional({ trim: true}),
        services: schema.string.optional({ trim: true}),
        category_id: schema.number.optional()
      })
  
      const validatedData = await request.validate({
        schema: validationSchema,
      })

      talent.name = validatedData.name;
      talent.services = validatedData.services;
      talent.categoryId = validatedData.category_id;

      await talent?.save();

      return response.status(200).send({
        success: true,
        message: 'talent updated',
        data: talent
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
   * delete a single talent
   */
   public async delete({ request, response, logger, params }: HttpContextContract) {
    try {

      const talent = await Talent.find(params.id)

      if (_.isEmpty(talent)) {
        return response.status(401).send({
          success: false, message: 'talent not found'
        })
      }

      await talent.delete()

      return response.status(200).send({
        success: true,
        message: 'talent deleted',
        data: talent
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
