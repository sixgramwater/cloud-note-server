import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';
import { DirectoryService } from './directory.service';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';

@Controller('directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createDirectoryDto: CreateDirectoryDto, @Req() req) {
    const { userId } = req.user;
    createDirectoryDto.userId = userId;
    const { parentId } = createDirectoryDto;
    createDirectoryDto.parentId = parentId;
    if(!parentId) {
      return this.directoryService.create(createDirectoryDto);
    } else {
      return this.directoryService.createByParentId(parentId, createDirectoryDto);
    } 
  }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req) {
    const { userId } = req.user;
    return this.directoryService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDirectoryDto: UpdateDirectoryDto) {
    return this.directoryService.update(id, updateDirectoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.directoryService.remove(id);
  }
}
