import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

// import { Note } from "src/notes/entities/notes.entity"

// type childType = Directory;
@Schema()
export class Directory extends Document{
  // directoryId:_id

  @Prop({
    required: true
  })
  name: string;
  // children

  @Prop({
    type: [],
  })
  childList: Directory[]

  @Prop()
  userId: string;

  @Prop()
  parentId: string;

  @Prop({
    default: 0
  })
  type: number;

  @Prop()
  updated: number;

}

export const DirectorySchema = SchemaFactory.createForClass(Directory);