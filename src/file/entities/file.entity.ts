import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000), createdAt: 'created', updatedAt: 'updated'
  }
})
export class File extends Document{
  @Prop({
    unique: true,
    index: true,
  })

  fileId: string;

  @Prop({
    required: true
  })
  name: string;

  @Prop({
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    index: true
  })
  parentId: string;

  @Prop()
  updated: number;

  @Prop()
  created: number;

  @Prop()
  dir: boolean;

  @Prop()
  type: number;

  @Prop({
    default: false
  })
  star: boolean;

  @Prop()
  starAt: number;

  @Prop({
    default: false
  })
  deleted: boolean;

  @Prop({
    default: false
  })
  shared: boolean;

  @Prop()
  sharedAt: number;

  @Prop({
    default: false
  })
  bloged: boolean;

  @Prop()
  blogedAt: number;
  // @Prop()

}

export const FileSchema = SchemaFactory.createForClass(File);

