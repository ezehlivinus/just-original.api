import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Talents extends BaseSchema {
  protected tableName = 'talents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('avatar').notNullable()

    table.integer('category_id').unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')

    table.string('services')
    table.integer('creator')
    table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTableIfExists(this.tableName)
  }
}
