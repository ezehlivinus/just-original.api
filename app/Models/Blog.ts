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

  import Category from './Category'

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public writer: string

  @column()
  public avatar: string

  @column()
  public url: string

  @column()
  public categoryId: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

}
