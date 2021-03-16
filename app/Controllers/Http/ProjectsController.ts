import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Project from 'App/Models/Project'
import Application from '@ioc:Adonis/Core/Application'
import _ from 'lodash'
import path from 'path'
import cloudinary from '../../../config/cloudinary'

export default class ProjectsController {
  /**
   * create a project
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
  
    const projectSchema = schema.create({

      title: schema.string({ trim: true}),
      url: schema.string({ trim: true}, [
        rules.url()
      ]),
      category: schema.string({ trim: true})
    })

    const validatedData = await request.validate({
      schema: projectSchema,
    })

    const projectData = {
      ...validatedData,
      avatar: cResponse.secure_url,
      creator: user.id
    }

    // handle create project
      try {
        const project = await Project.create(projectData)

        return response.status(201).send({
          success: true,
          message: 'project created',
          data: project
        });
      } catch (error) {
        logger.error(error)
        return response.status(500).send({
          success: false,
          message: 'failed creating new project'
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
   * list all projects
   */
  public async list({ response, logger }: HttpContextContract) {
    try {

      const projects = await Project.all()

      if (_.isEmpty(projects)) {
        return response.status(200).send({
          success: false, message: 'projects not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'project list',
        data: projects
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
   * retrieve a single projects
   */
   public async retrieve({ response, logger, params }: HttpContextContract) {
    try {

      const project = await Project.find(params.id)

      if (_.isEmpty(project)) {
        return response.status(200).send({
          success: false, message: 'project not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'project retrieved',
        data: project
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
   * update a single project
   */
   public async update({ request, response, logger, params }: HttpContextContract) {
    try {

      const project = await Project.find(params.id)

      if (_.isEmpty(project)) {
        return response.status(200).send({
          success: false, message: 'project not found'
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
        project.avatar = cResponse.secure_url;
      }

      const validationSchema = schema.create({

        title: schema.string({ trim: true}),
        url: schema.string({ trim: true}, [
          rules.url()
        ]),
        category: schema.string({ trim: true})
      })
  
      const validatedData = await request.validate({
        schema: validationSchema,
      })

      project.title = validatedData.title;
      project.url = validatedData.url;
      project.category = validatedData.category;

      await project?.save();

      return response.status(200).send({
        success: true,
        message: 'project updated',
        data: project
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
   * delete a single projects
   */
   public async delete({ request, response, logger, params }: HttpContextContract) {
    try {

      const project = await Project.find(params.id)

      if (_.isEmpty(project)) {
        return response.status(200).send({
          success: false, message: 'project not found'
        })
      }

      await project.delete()

      return response.status(200).send({
        success: true,
        message: 'project deleted',
        data: project
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
