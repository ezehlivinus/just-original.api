import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Project from 'App/Models/Project'
import TalentProject from 'App/Models/TalentProject'
import _ from 'lodash'

export default class TalentProjectsController {
  public async create ({ request, response, logger }): HttpContextContract {
    try {

      // validate request
      const talentProjectSchema = schema.create({
        project_id: schema.number(),
        talent_id: schema.number()
      })
  
      const talentProjectData = await request.validate({
        schema: talentProjectSchema,
      })
      
      const talentProject = await TalentProject.create(talentProjectData)

    } catch (error) {
      logger.error(error)
      return response.status(400).send({
        success: false,
        message: error.messages
      })
    }
  }

  public async list () {

  }

  public async retrieve () {

  }

  public async update () {

  }

  public async delete () {

  }
}
