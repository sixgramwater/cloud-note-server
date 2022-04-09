import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './entities/notes.entity';
import { Model } from 'mongoose';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<Note>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.noteModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const note = await this.noteModel.findOne({ _id: id }).exec()
    if(!note) {
      // throw new HttpException(`Note #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Note #${id} not found`);
    }
    return note;
  }

  create(createNoteDto: CreateNoteDto) {
    const coffee = new this.noteModel(createNoteDto);
    // this.notes.push(createNotesDto);
    return coffee.save();
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const existingNote = await this.noteModel
      .findOneAndUpdate({ _id: id }, { $set: updateNoteDto }, { new: true })  // { new: true }保证了返回的是我们更新后的对象，而不是update之前的原对象(默认情况)
      .exec()

    // const existingNote = this.findOne(id);
    if(!existingNote) {
      throw new NotFoundException(`Note #${id} not found`);
      // update
    }
    return existingNote;
  }

  async remove(id: string) {
    const note = await this.findOne(id);
    return note.remove();
  }

}
