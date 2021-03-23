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
import TalentProject from './TalentProject'


export default class Talent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public avatar: string

  @column()
  public services: string

  @column()
  public categoryId: number

  @column()
  public creator: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasManyThrough([() => Project, () => TalentProject])
  public projects: HasManyThrough<typeof Project>
}
