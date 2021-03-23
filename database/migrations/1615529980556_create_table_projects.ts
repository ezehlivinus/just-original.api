import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    const tableExist: boolean = await this.schema.hasTable(this.tableName)
    if (tableExist) {
      return true;
    }
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.string('url')
      table.string('avatar')
      table.enum('status', ['Not started', 'Completed', 'Ongoing'])
        .defaultTo('Not started')
      table.integer('category_id').unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.string('client').notNullable()
      // the person (user) that(who) created the project : it is not used, it for record keeping
      table.integer('creator').unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamps(true, true)

    })
  }

  public async down () {
    this.schema.dropTableIfExists(this.tableName)
  }
}
