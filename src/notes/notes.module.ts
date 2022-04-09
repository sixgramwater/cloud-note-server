import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DirectoryModule } from 'src/directory/directory.module';
import { Note, NoteSchema } from './entities/notes.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Note.name,
        schema: NoteSchema,
      },
    ]),
    DirectoryModule
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
