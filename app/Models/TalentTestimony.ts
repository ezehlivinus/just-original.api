import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  manytoMany,
  ManyToMany,
  hasManyThrough,
  HasManyThrough} from '@ioc:Adonis/Lucid/Orm'

import Project from './Project'
import Talent from './Talent'

export default class TalentTestimony extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public content: string

  @column()
  public projectId: number

  @column()
  public talentId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // relations
  
  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @belongsTo(() => Talent)
  public talent: BelongsTo<typeof Talent>
}
