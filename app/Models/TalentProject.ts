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

export default class TalentProject extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number

  @column()
  public talentId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Project)
  public projects: BelongsTo<typeof Project>

  @belongsTo(() => Talent)
  public talents: BelongsTo<typeof Talent>
}
