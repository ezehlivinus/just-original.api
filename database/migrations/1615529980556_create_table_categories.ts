import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Categories extends BaseSchema {
  protected tableName = 'categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').unique().notNullable()
      table.string('description').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTableIfExists(this.tableName)
  }
}
