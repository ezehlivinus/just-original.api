import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Project from 'App/Models/Project'
import Talent from 'App/Models/Talent'
import TalentProject from 'App/Models/TalentProject'
import _ from 'lodash'

export default class TalentProjectsController {
  public async create ({ request, response, logger, params }: HttpContextContract) {
    try {
      // validate request
      const talentProjectSchema = schema.create({
        project_id: schema.number(),
        // talentId: schema.number()
      })
  
      const talentProjectData = await request.validate({
        schema: talentProjectSchema,
      })

      try {
        const talentProject = await TalentProject.create({
          projectId: talentProjectData.project_id,
          talentId: Number.parseInt(params.talent_id)
        })

        return response.status(201).send({
          success: true,
          message: talentProject
        })
      } catch (error) {
        return response.status(500).send({
          success: false,
          message: 'failed creating adding project to talent',
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

  public async retrieve ({ request, response, logger, params }: HttpContextContract) {
    try {

      const talentProjects = await TalentProject.query()
        .where('talent_id', params.talent_id)
        .preload('projects')

      if (_.isEmpty(talentProjects)) {
        return response.status(404).send({
          success: false, message: 'Projects not found this talent'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'Talent\'s Projects list',
        data: talentProjects
      })

    } catch(error) {
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.messages,
      })
    }
  }

  public async update ({ request, response, logger, params }: HttpContextContract) {
    try {

      const talentProjectSchema = schema.create({
        project_id: schema.number(),
        // talentId: schema.number()
      })
  
      const talentProjectData = await request.validate({
        schema: talentProjectSchema,
        messages: {
          'project_id.required': 'project_id is required',
          'project_id.number': 'Invalid value provided for the {{ field }}',
        },
      })

      const talentProject = await TalentProject
        .query()
        .where('talent_id', params.talent_id)
        .where('project_id', talentProjectData.project_id)
        .first()

      if (_.isEmpty(talentProject)) {
        return response.status(404).send({
          success: false, message: 'talentProject not found'
        })
      }

      const input: number = talentProjectData.project_id;

      const projectId: number = input === undefined || null ? talentProject.projectId : input

      talentProject.projectId = projectId;
      
      await talentProject?.save();

      return response.status(200).send({
        success: true,
        message: 'talentProject updated',
        data: talentProject
      })
    } catch (error){
      
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
      const talentProjectSchema = schema.create({
        project_id: schema.number(),
        // talentId: schema.number()
      })
  
      const talentProjectData = await request.validate({
        schema: talentProjectSchema,
      })


      const talentProject = await TalentProject
        .query()
        .where('talent_id', params.talent_id)
        .where('project_id', talentProjectData.project_id)
        .first()

      if (_.isEmpty(talentProject)) {
        return response.status(401).send({
          success: false, message: 'talent Projects not found'
        })
      }

      await talentProject.delete()

      return response.status(200).send({
        success: true,
        message: 'talent projects deleted',
        data: talentProject
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
