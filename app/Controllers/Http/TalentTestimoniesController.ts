import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import TalentTestimony from 'App/Models/TalentTestimony'
import _ from 'lodash'

export default class TalentTestimoniesController {
    public async create ({ request, response, logger, params }: HttpContextContract) {
        try {
          // validate request
          const testimonySchema = schema.create({
            project_id: schema.number(),
            content: schema.string()
          })
      
          const testimonyData = await request.validate({
            schema: testimonySchema,
          })
    
          try {
            const testimony= await TalentTestimony.create({
              projectId: testimonyData.project_id,
              talentId: Number.parseInt(params.talent_id),
              content: testimonyData.content
            })
    
            return response.status(201).send({
              success: true,
              message: testimony
            })
          } catch (error) {
            return response.status(500).send({
              success: false,
              message: 'failed creating testimony',
              messages: error
            })
          }
    
        } catch (error) {
          logger.error(error)
          return response.status(400).send({
            success: false,
            message: error.messages
          })
        }
      }

      public async list ({ request, response, logger, params }: HttpContextContract) {
        try {
    
          const testimonies = await TalentTestimony.query()
            .where('talent_id', params.talent_id)
            .preload('project')
    
          if (_.isEmpty(testimonies)) {
            return response.status(404).send({
              success: false, message: 'testimonies not found for this talent'
            })
          }
    
          return response.status(200).send({
            success: true,
            message: 'testimonies list',
            data: testimonies
          })
    
        } catch(error) {
          logger.error(error);
          return response.status(401).send({
            success: false,
            message: error.messages,
          })
        }
      }

      public async delete ({ request, response, logger, params }: HttpContextContract) {
        try {
    
          // validate request
          const testimonySchema = schema.create({
            project_id: schema.number(),
            // content: schema.string.optional()
          })
      
          const testimonyData = await request.validate({
            schema: testimonySchema,
          })
    
    
          const testimony = await TalentTestimony
            .query()
            .where('talent_id', params.talent_id)
            .where('project_id', testimonyData.project_id)
            .where('id', params.id)
            .first()
    
          if (_.isEmpty(testimony)) {
            return response.status(401).send({
              success: false, message: 'testimony not found'
            })
          }
    
          await testimony.delete()
    
          return response.status(200).send({
            success: true,
            message: 'testimony deleted',
            data: testimony
          })
        } catch (error){
          
          logger.error(error);
          return response.status(401).send({
            success: false,
            message: error.messages,
          })
        }
      }

      public async update ({ request, response, logger, params }: HttpContextContract) {
        try {
    
          const testimonySchema = schema.create({
            project_id: schema.number(),
            content: schema.string.optional()
          })
      
          const testimonyData = await request.validate({
            schema: testimonySchema
          })
    
          const testimony = await TalentTestimony
            .query()
            .where('talent_id', params.talent_id)
            .where('project_id', testimonyData.project_id)
            .where('id', params.id)
            .first()

          if (_.isEmpty(testimony)) {
            return response.status(404).send({
              success: false, message: 'testimony not found'
            })
          }
    
          const input: number = testimonyData.project_id;
      // make sure that the projectId is not null or undefined
    
          const projectId: number = input === undefined || null ? testimony.projectId : input
    
          testimony.projectId = projectId;
          testimony.content = testimonyData;
          
          await testimony?.save();
    
          return response.status(200).send({
            success: true,
            message: 'testimony updated',
            data: testimony
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
