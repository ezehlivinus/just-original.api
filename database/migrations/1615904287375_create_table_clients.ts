import BaseSchema from '@ioc:Adonis/Lucid/Schema'

// This table is not used, whenever you want to use it,
//  removed this comment and drop the table from database if exist and also
// delete it from adonis_schema row in db, then run migration
export default class Clients extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('avatar').notNullable()
      table.string('service_type')
      table.string('url')
      table.string('service_required')
      table.integer('creator')
      table.timestamps(true, true)
    })
  }
  
    public async down () {
      this.schema.dropTableIfExists(this.tableName)
    }
}
