import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Testimonies extends BaseSchema {
  protected tableName = 'testimonies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
    table.increments('id').primary()
    table.text('content').notNullable()

    // name of the client can be gotten from the project
    table.integer('project_id').unsigned()
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE')

    table.integer('talent_id').unsigned()
      .references('id')
      .inTable('talents')
      .onDelete('CASCADE')

    table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTableIfExists(this.tableName)
  }
}
