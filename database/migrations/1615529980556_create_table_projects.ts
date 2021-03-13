import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    const tableExist: boolean = await this.schema.hasTable(this.tableName)
    if (tableExist) {
      return true;
    }
    this.schema.table(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.string('url')
      table.string('image')
      table.string('category')
      // the person (user) that(who) created the project
      table.integer('creator')
      table.timestamps(true, true)

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
