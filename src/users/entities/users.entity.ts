import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  nickname: string;

  // @Exclude()
  @Prop()
  password: string;

  @Prop()
  avatarUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);