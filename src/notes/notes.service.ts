import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Notes } from './entities/notes.entity';

@Injectable()
export class NotesService {
  private notes: Notes[] = [
    {
      id: 1,
      title: 'notes 1',
      content: 'This is the content of the notes',
    }
  ];

  findAll() {
    return this.notes;
  }

  findOne(id: string) {
    const note = this.notes.find(item => item.id === +id);
    if(!note) {
      // throw new HttpException(`Note #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Note #${id} not found`);
    }
    return note;
  }

  create(createNotesDto) {
    this.notes.push(createNotesDto);
    return createNotesDto;
  }

  update(id: string, updateNotesDto) {
    const existingNote = this.findOne(id);
    if(existingNote) {
      // update
    }
  }

  remove(id: string) {
    const noteIndex = this.notes.findIndex(item => item.id === +id);
    if (noteIndex >= 0) {
      this.notes.splice(noteIndex, 1);
    }
  }

}
