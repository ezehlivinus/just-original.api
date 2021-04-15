import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Blog from 'App/Models/Blog'
import _ from 'lodash'
import Application from '@ioc:Adonis/Core/Application'
import cloudinary from '../../../config/cloudinary'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BlogsController {
    public async create({ request, auth, response, logger }: HttpContextContract) {

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

        const blogSchema = schema.create({
        title: schema.string({ trim: true}),
        url: schema.string({ trim: true}, [
            rules.url()
        ]),
        writer: schema.string({ trim: true}),
        category_id: schema.number()
        })

        const validatedData = await request.validate({
        schema: blogSchema,
        })

        const blogData = {
            categoryId: validatedData.category_id,
            avatar: cResponse.secure_url,
            title: validatedData.title,
            url: validatedData.url,
            writer: validatedData.writer,

        }

    // handle create new blog
        try {
        const blog = await Blog.create(blogData)

        return response.status(201).send({
            success: true,
            message: 'blog created',
            data: blog
        });
        } catch (error) {
        logger.error(error)
        return response.status(500).send({
            success: false,
            message: 'failed creating new blog',
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

public async list({ request, response, logger }: HttpContextContract) {
  try {

    // Handle search
    const search = !(_.isEmpty(request.get()))
    if (search) {
      return this.search({ request, response, logger });
    } 

      const blogs = await Blog.query()
        .preload('category').orderBy('created_at', 'desc')

      if (_.isEmpty(blogs)) {
      return response.status(404).send({
          success: false, message: 'blogs not found'
      })
      }

      return response.status(200).send({
      success: true,
      message: 'blog list',
      data: blogs
      })

  } catch(error) {
      logger.error(error);
      return response.status(401).send({
      success: true,
      message: error.message,
      })
  }
  }

  public async retrieve ({ request, response, logger, params }: HttpContextContract) {
    try {

      const blog = await Blog.query()
        .where('id', params.id)
        .preload('category')

      if (_.isEmpty(blog)) {
        return response.status(404).send({
          success: false, message: 'blog not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'Blog detail',
        data: blog[0]
      })

    } catch(error) {
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.messages,
      })
    }
  }

  public async update({ request, response, logger, params }: HttpContextContract) {
    try {

      const blog = await Blog.find(params.id)

      if (_.isEmpty(blog)) {
        return response.status(404).send({
          success: false, message: 'blog not found'
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

      blog.avatar = _cResponse === undefined || null ? blog.avatar : _cResponse

      const validationSchema = schema.create({

        title: schema.string.optional({ trim: true}),
        writer: schema.string.optional({ trim: true}),
        url: schema.string.optional({ trim: true}, [
          rules.url()
        ]),
        category_id: schema.number.optional()
      })
  
      const validatedData = await request.validate({
        schema: validationSchema,
      })

      blog.title = validatedData.title;
      blog.writer = validatedData.writer;
      blog.categoryId = validatedData.category_id;
      blog.url = validatedData.url;

      await blog?.save();
      await blog.preload('category')

      return response.status(200).send({
        success: true,
        message: 'blog updated',
        data: blog
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

  public async delete({ request, response, logger, params }: HttpContextContract) {
    try {

      const blog = await Blog.find(params.id)

      if (_.isEmpty(blog)) {
        return response.status(401).send({
          success: false, message: 'blog not found'
        })
      }

      await blog.delete()

      return response.status(200).send({
        success: true,
        message: 'blog deleted',
        data: blog
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.message,
      })
    }

  }

  public async search ({ request, response, logger }) {
    try {

      const results = await Blog.query()
        .where('title', 'like', `%${request.input('search')}%`)
        .preload('category')

      if (_.isEmpty(results)) {
        return response.status(404).send({
          success: false, message: 'no blog searched'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'search result',
        data: results
      })

    } catch(error) {
      logger.error(error);
      return response.status(401).send({
        success: false,
        message: error.messages,
      })
    }
  }
}
