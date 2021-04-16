import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Form from 'App/Models/Form'
import _ from 'lodash'
import Application from '@ioc:Adonis/Core/Application'
import cloudinary from '../../../config/cloudinary'

export default class FormsController {
  public byteToMb (byte: number): string {
      const oneByte = 0.000001 //mb
      const mb = byte * oneByte
      return mb > 1 ? `${Math.ceil(mb)}MB` : `${Math.ceil(mb * 1024)}KB`
    }
    /**
   * @description list all forms
   */
     public async list({ response, logger }: HttpContextContract) {
      try {
  
        const forms = await Form.all()
  
        if (_.isEmpty(forms)) {
          return response.status(404).send({
            success: false, message: 'forms not found'
          })
        }
  
        return response.status(200).send({
          success: true,
          message: 'forms list',

          data: forms.map((form) => {
            form.attachments = JSON.parse(form.attachments)
            return form;
          })
          
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
   * create a form
   */
  public async create({ request, auth, response, logger }: HttpContextContract) {

    try {

      const attachments = request.file('attachments', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
  
      if (!attachments) {
        return response.status(400).send({
          success: false,
          message: 'Please upload/attach a file, make sure the field {attachments} is used'
        })
      }
  
      if (attachments.hasErrors) {
        return response.status(400).send({
          success: false,
          message: attachments.errors[0].message
        })
      }
      
      await attachments.move(Application.tmpPath('uploads'), {
        name: `${new Date().getTime()}.${attachments.extname}`,
      })

      const { cResponse, success } = await cloudinary.uploadImage(attachments.filePath);
      if (!success) return response.status(500).send({
        success, cResponse
      })

      const formSchema = schema.create({
        description: schema.string({ trim: true}),
        duration: schema.string({ trim: true}),
        budget: schema.number()
      })

      const validatedData = await request.validate({
        schema: formSchema,
      })

      const fileInfo = {
        [attachments.clientName]: cResponse.secure_url,
        bytes: cResponse.bytes,
        size: this.byteToMb(cResponse.bytes)
      }

      const _attachments = JSON.stringify(fileInfo)
 
      const formData = {
        description: validatedData.description,
        duration: validatedData.duration,
        budget: validatedData.budget,
        attachments: _attachments
      }

    // handle create new form
      try {
        const form = await Form.create(formData)

        return response.status(201).send({
          success: true,
          message: 'form created',
          data: form.serialise()
        })

      } catch (error) {
        logger.error(error)
        return response.status(500).send({
          success: false,
          message: 'failed creating new form'
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
   * retrieve a single form
   */
  public async retrieve({ response, logger, params }: HttpContextContract) {
    try {

      const form = await Form.find(params.id)

      if (_.isEmpty(form)) {
        return response.status(401).send({
          success: false, message: 'form not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'form retrieved',
        data: form.serialise()
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.messages,
      })
    }
  }

  /**
   * update a single form
   */
  public async update({ request, response, logger, params }: HttpContextContract) {
    try {

      const form = await Form.find(params.id)

      if (_.isEmpty(form)) {
        return response.status(404).send({
          success: false, message: 'form not found'
        })
      }

      const attachments = request.file('attachments', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      let cResponse: any;

      if (attachments) {
        if (attachments.hasErrors) {
          return response.status(400).send({
            success: false,
            message: attachments.errors[0].message
          })
        }

        await attachments.move(Application.tmpPath('uploads'), {
          name: `${new Date().getTime()}.${attachments.extname}`,
        })
  
        const { cResponse, success } = await cloudinary.uploadImage(attachments.filePath);
        if (!success) return response.status(500).send({
          success, cResponse
        })

        const fileInfo = {
          [attachments.clientName]: cResponse.secure_url,
          bytes: cResponse.bytes,
          size: this.byteToMb(cResponse.bytes)
        }

        form.attachments = JSON.stringify(fileInfo);
      }

      const formSchema = schema.create({
        description: schema.string({ trim: true}),
        duration: schema.string({ trim: true}),
        budget: schema.number()
      })

      const formData = await request.validate({
        schema: formSchema,
      })

      form.description = formData.description;
      form.duration = formData.duration;
      form.budget = formData.budget;
      
      await form?.save();

      return response.status(200).send({
        success: true,
        message: 'form updated',
        data: form.serialise()
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.messages,
      })
    }
  }

  
  /**
   * delete a single form
   */
   public async delete({ response, logger, params }: HttpContextContract) {
    try {

      const form = await Form.find(params.id)

      if (_.isEmpty(form)) {
        return response.status(401).send({
          success: false, message: 'form not found'
        })
      }

      await form.delete()

      return response.status(200).send({
        success: true,
        message: 'form deleted',
        data: form.serialise()
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.messages,
      })
    }
  }

}
