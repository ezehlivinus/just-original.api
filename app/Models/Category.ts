import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  manytoMany,
  ManyToMany,
  hasManyThrough,
  HasManyThrough
} from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>
}
