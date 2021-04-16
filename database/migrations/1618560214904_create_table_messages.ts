import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('sender').notNullable()
      table.string('email').notNullable()
      table.string('phone').notNullable()
      table.string('message').notNullable()
      table.boolean('is_read').defaultTo(false).notNullable()
      table.timestamps(true, true)
    })
  }
  
  public async down () {
    this.schema.dropTableIfExists(this.tableName)
  }
}
