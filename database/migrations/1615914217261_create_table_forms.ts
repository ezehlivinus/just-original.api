import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Forms extends BaseSchema {
  protected tableName = 'forms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.text('description').notNullable()
      table.json('attachments').nullable()
      table.string('duration')
      table.decimal('budget')

      table.timestamps(true, true)
    })
  }
  
  public async down () {
    this.schema.dropTableIfExists(this.tableName)
  }
}
