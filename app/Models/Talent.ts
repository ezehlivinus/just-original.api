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
import TalentTeam from './TalentTeam'
import Category from './Category'


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

  @hasManyThrough([() => TalentProject, () => Project])
  public projects: HasManyThrough<typeof TalentProject>

  @hasManyThrough([() => TalentProject, () => Talent])
  public talents: HasManyThrough<typeof TalentProject>

  @hasManyThrough([() => TalentTeam, () => Talent])
  public teams: HasManyThrough<typeof TalentTeam>
  
  
  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>
}
