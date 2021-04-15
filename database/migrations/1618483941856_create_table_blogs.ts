import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Blogs extends BaseSchema {
  protected tableName = 'blogs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.string('avatar').notNullable()
      table.string('url').notNullable()
      table.string('writer')
  
      table.integer('category_id').unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
  
      table.timestamps(true, true)
    })
  }
  
    public async down () {
      this.schema.dropTableIfExists(this.tableName)
    }
}
