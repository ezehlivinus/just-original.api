
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Project from 'App/Models/Project'
import Talent from 'App/Models/Talent'
import TalentProject from 'App/Models/TalentProject'
import TalentTeam from 'App/Models/TalentTeam'
import _ from 'lodash'

export default class TalentTeamsController {
    public async create ({ request, response, logger, params }: HttpContextContract) {
        try {
          // validate request
          const talentTeamSchema = schema.create({
            project_id: schema.number(),
            team_member: schema.string(),
            // talentId: schema.number()
          })
      
          const talentTeamData = await request.validate({
            schema: talentTeamSchema,
          })
    
          try {
            const talentTeam= await TalentTeam.create({
              projectId: talentTeamData.project_id,
              talentId: Number.parseInt(params.talent_id),
              teamMember: talentTeamData.team_member
            })
    
            return response.status(201).send({
              success: true,
              message: talentTeam
            })
          } catch (error) {
            return response.status(500).send({
              success: false,
              message: 'failed creating adding team member',
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
    
          const talentTeams = await TalentTeam.query()
            .where('talent_id', params.talent_id)
            .preload('project')
    
          if (_.isEmpty(talentTeams)) {
            return response.status(404).send({
              success: false, message: 'Team member not found for this talent'
            })
          }
    
          return response.status(200).send({
            success: true,
            message: 'Team member list',
            data: talentTeams
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
          const talentTeamSchema = schema.create({
            project_id: schema.number()
          })
      
          const talentTeamData = await request.validate({
            schema: talentTeamSchema,
          })
    
    
          const teamMember = await TalentTeam
            .query()
            .where('talent_id', params.talent_id)
            .where('project_id', talentTeamData.project_id)
            .where('id', params.id)
            .first()
    
          if (_.isEmpty(teamMember)) {
            return response.status(401).send({
              success: false, message: 'team member not found'
            })
          }
    
          await teamMember.delete()
    
          return response.status(200).send({
            success: true,
            message: 'team member deleted',
            data: teamMember
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
