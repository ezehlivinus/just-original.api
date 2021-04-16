import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import _ from 'lodash'
import Category from 'App/Models/Category'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class CategoriesController {
  
  /**
   * list all categories
   */
   public async list({ response, logger }: HttpContextContract) {
    try {

      const categories = await Category.all()

      if (_.isEmpty(categories)) {
        return response.status(400).send({
          success: false, message: 'categories not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'categories list',
        data: categories
      })
    } catch (error){

      logger.error(error);
      return response.status(401).send({
        success: true,
        message: error.messages,
      })
    }
  }

  /**
   * create a categories
   */
  public async create({ request, response, logger }: HttpContextContract) {
  
    try {

    const categorySchema = schema.create({
      name: schema.string({ trim: true }),
      description: schema.string.optional({ trim: true})
    })

    const categoryData = await request.validate({
      schema: categorySchema,
    })

    const _category = await Category.findBy('name', request.input('name'))

    if (!(_.isEmpty(_category))) {
      return response.status(409).send({
        success: false, message: 'category already exist'
      })
    }

    // handle create category
      try {
        const category = await Category.create(categoryData)

        return response.status(201).send({
          success: true,
          message: 'category created',
          data: category
        });
      } catch (error) {
        logger.error(error)
        return response.status(500).send({
          success: false,
          message: 'failed creating new category',
          hint: error
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

  /**
   * retrieve a single category
   */
  public async retrieve({ response, logger, params }: HttpContextContract) {
    try {

      const category = await Category.find(params.id)

      if (_.isEmpty(category)) {
        return response.status(404).send({
          success: false, messages: 'category not found'
        })
      }

      return response.status(200).send({
        success: true,
        message: 'category retrieved',
        data: category
      })
    } catch (error){
      
      logger.error(error);
      return response.status(401).send({
        success: true,
        message: error.messages,
      })
    }
  }

    /**
   * update a single category
   */
   public async update({ request, response, logger, params }: HttpContextContract) {
    try {

      // check for existence
      const category = await Category.find(params.id)

      if (_.isEmpty(category)) {
        return response.status(404).send({
          success: false, message: 'category not found'
        })
      }

      const categorySchema = schema.create({
        name: schema.string({ trim: true }),
        description: schema.string({ trim: true})
      })
  
      const categoryData = await request.validate({
        schema: categorySchema,
      })

      // check for duplicate
      const _category = await Category.findBy('name', categoryData.name)
      if (!(_.isEmpty(_category))) {
        return response.status(409).send({
          success: false, message: 'duplicate: this category already exist'
        })
      }
  
      category.name = categoryData.name;
      category.description = categoryData.description;

      await category?.save();

      return response.status(200).send({
        success: true,
        message: 'category updated',
        data: category
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
   * delete a single category
   */
     public async delete({ request, response, logger, params }: HttpContextContract) {
      try {
  
        const category = await Category.find(params.id)
  
        if (_.isEmpty(category)) {
          return response.status(404).send({
            success: false, message: 'category not found'
          })
        }
  
        await category.delete()
  
        return response.status(200).send({
          success: true,
          message: 'category deleted',
          data: category
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
