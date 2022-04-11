import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000), createdAt: 'created', updatedAt: 'updated'
  }
})
export class FileContent extends Document{
  @Prop({
    unique: true,
    index: true,
    required: true
  })
  fileId: string;

  @Prop({
    required: true
  })
  userId: string;

  @Prop()
  bodyString: string;

  @Prop()
  updated: number;

  @Prop()
  created: number;

  @Prop()
  modifyTime: number;
}

export const FileContentSchema = SchemaFactory.createForClass(FileContent);

