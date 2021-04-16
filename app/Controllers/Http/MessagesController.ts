import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import _ from 'lodash'
import Message from 'App/Models/Message'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class MessagesController {
    public async create({ request, response, logger }: HttpContextContract) {
  
        try {
    
        const messageSchema = schema.create({
          sender: schema.string({ trim: true }),
          email: schema.string({ trim: true}, [
            rules.email()
          ]),
          phone: schema.string({ trim: true}),
          message: schema.string()
        })
    
        const messageData = await request.validate({
          schema: messageSchema,
        })

        // handle create new message
          try {
            const message = await Message.create(messageData)
    
            return response.status(201).send({
              success: true,
              message: 'message sent',
              data: message
            });
          } catch (error) {
            logger.error(error)
            return response.status(500).send({
              success: false,
              message: 'failed creating new message',
              hint: error
            })
          }
    
        } catch (error) {
          logger.error(error)
          return response.status(400).send({
            success: false,
            message: error.messages,
            hint: error
          })
        }
        
      }

      public async list({ response, logger }: HttpContextContract) {
        try {
    
          const messages = await Message.query()
            .orderBy('created_at', 'desc')
    
          if (_.isEmpty(messages)) {
            return response.status(400).send({
              success: false, message: 'messages not found'
            })
          }
    
          return response.status(200).send({
            success: true,
            message: 'message list',
            data: messages
          })
        } catch (error){
    
          logger.error(error);
          return response.status(401).send({
            success: true,
            message: error.messages,
          })
        }
      }

      public async retrieve({ response, logger, params }: HttpContextContract) {
        try {
    
          const message = await Message.find(params.id)
    
          if (_.isEmpty(message)) {
            return response.status(404).send({
              success: false, messages: 'message not found'
            })
          }
    
          return response.status(200).send({
            success: true,
            message: 'message retrieved',
            data: message
          })
        } catch (error){
          
          logger.error(error);
          return response.status(401).send({
            success: true,
            message: error.messages,
          })
        }
      }


  public async delete({ request, response, logger, params }: HttpContextContract) {
    try {

      const message = await Message.find(params.id)

      if (_.isEmpty(message)) {
        return response.status(404).send({
          success: false, message: 'message not found'
        })
      }

      await message.delete()

      return response.status(200).send({
        success: true,
        message: 'message deleted',
        data: message
      })
    } catch (error){
      
      logger.error(error);
      return response.status(400).send({
        success: false,
        message: error.messages,
      })
    }

  }
    
}
