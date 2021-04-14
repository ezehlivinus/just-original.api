import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TalentTeams extends BaseSchema {
  protected tableName = 'talent_teams'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
    table.increments('id').primary()
    table.string('team_member').notNullable()
    // table.string('avatar').notNullable()

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
