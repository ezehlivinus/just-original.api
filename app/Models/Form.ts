import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Form extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public attachments: string

  @column()
  public duration: string

  @column()
  public budget: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public serialise () {
    return {
      id: this.id,
      description: this.description,
      duration: this.duration,
      budget: this.budget,
      attachments: JSON.parse(this.attachments),
      created_at: this.createdAt,
      updated_at: this.updatedAt
    }
  }
}
