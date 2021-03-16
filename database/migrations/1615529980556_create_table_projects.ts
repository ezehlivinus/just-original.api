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
      table.string('category')
      // the person (user) that(who) created the project
      table.integer('creator')
      table.timestamps(true, true)

    })
  }

  public async down () {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
