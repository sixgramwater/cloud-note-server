import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000), createdAt: 'created', updatedAt: 'updated'
  }
})

export class Upload extends Document {
  @Prop()
  originalname: string;

  @Prop()
  filename: string;

  @Prop()
  userId: string;

  @Prop()
  type: string;

  @Prop()
  size: number;
}

export const UploadSchema = SchemaFactory.createForClass(Upload)