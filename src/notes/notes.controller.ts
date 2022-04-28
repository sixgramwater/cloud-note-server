import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DirectoryService } from 'src/directory/directory.service';
import { CreateDirectoryDto } from 'src/directory/dto/create-directory.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly directoryService: DirectoryService,
  ) {}
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.notesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Req() req) {
    const { userId } = req.user;
    createNoteDto.userId = userId;
    const { directoryId } = createNoteDto;
    
    const note = await this.notesService.create(createNoteDto);
    const createDirectoryDto: (CreateDirectoryDto & { _id: any }) = {
      _id: note._id,
      name: note.title,
      updated: note.updated,
      type: note.type,
      parentId: note.directoryId,
      userId: userId,
    }
    if(directoryId) {
      return this.directoryService.insertByParentId(directoryId, createDirectoryDto);
    } else {
      return this.directoryService.create(createDirectoryDto);
    }
    // return directory;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
