import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000), createdAt: 'created', updatedAt: 'updated'
  }
})
export class Note extends Document {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  created?: number;

  @Prop()
  updated?: number;

  @Prop()
  userId: string;

  @Prop({
    default: 1
  })
  type: number;

  @Prop()
  directoryId?: string;

}

export const NoteSchema = SchemaFactory.createForClass(Note);