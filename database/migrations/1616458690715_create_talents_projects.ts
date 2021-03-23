import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TalentProjects extends BaseSchema {
  protected tableName = 'talent_projects'

  
  public async up () {
    const tableExist: boolean = await this.schema.hasTable(this.tableName)
    if (tableExist) {
      return true;
    }
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

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
