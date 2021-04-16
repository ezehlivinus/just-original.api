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
  afterFetch,
  beforeSave
  HasManyThrough,
  afterFind} from '@ioc:Adonis/Lucid/Orm'
  import _ from 'lodash'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sender: string

  @column()
  public email: string

  @column()
  public isRead: boolean

  @column()
  public phone: string

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterFetch()
  public static afterFetchHook (messages: Message[]) {
    const _messages = messages.map((message) => {
      message.isRead = message.isRead ? true : false;
      return message
    })
    return _messages
  }

  @afterFind()
  public static async hashPassword (message: Message) {
    if (!message.isRead) {
      message.isRead = true;
      await message?.save();
    }
    return message;
  }
}
