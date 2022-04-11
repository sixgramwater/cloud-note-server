import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { AuthGuard } from '@nestjs/passport';
import { SyncFileDto } from './dto/sync-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // listPath
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createFileDto: CreateFileDto, @Req() req) {
    const { userId } = req.user;
    createFileDto.userId = userId;
    return this.fileService.create(createFileDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req, @Query() query) {
    const { method } = query;
    const { userId } = req.user;
    const entries = await this.fileService.findAll(userId);
    const rootEntryIndex = entries.findIndex(
      (entry) => entry.parentId === null,
    );
    const rootEntry = entries[rootEntryIndex];
    if (!method) {
      return rootEntry;
    } else if (method === 'listPageByRoot') {
      return this.fileService.findAllDir(userId, rootEntry.fileId);
    }
    // let result = {
    //   ...rootEntry,
    //   child: [],
    // }
    // const dfs = (parentId: string, child: any[]) => {
    //   const children = entries.filter(entry => entry.parentId === parentId);
    //   if(!children || children.length === 0)  return;
    //   child =
    //   children.forEach((child => {

    //   })
    //   child = dfs(children)
    // }

    return rootEntry;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query, @Req() req) {
    const { method, all, sort } = query;
    const { userId } = req.user;
    if (!method) {
      const page = await this.fileService.findAll(userId, id);
      return {
        count: page.length,
        entries: page,
      };
    } else if (method === 'listById') {
      // 所有文件夹
      return this.fileService.findOne(id);
    } else if (method === 'listPageByParentId') {
      const page = await this.fileService.findAllDir(userId, id);
      return {
        count: page.length,
        entries: page,
      };
    } else {
      throw new BadRequestException();
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sync')
  async sync(@Body() syncFileDto: SyncFileDto, @Req() req, @Query() query) {
    const { userId } = req.user;
    const { fileId } = syncFileDto;
    const { method } = query;
    if(!method) {
      throw new BadRequestException()
    } else if(method === 'push') {
      const { bodyString, name, fileId, parentId } = syncFileDto;
      // 第一次创建
      if(name) {
        syncFileDto.userId = userId;
        if(!parentId  || !fileId)  throw new BadRequestException();
        const createDto = syncFileDto as CreateFileDto;
        const entry = await this.fileService.create(createDto);
        try{
          await this.fileService.createFileContent(fileId, syncFileDto);

        } catch(err) {
          console.log(err);
        }
        return entry;
      } else {
        // 更新
        const entry = await this.fileService.findOne(fileId);
        if(!entry) {
          throw new NotFoundException();
        }
        await this.fileService.updateFileContent(fileId, syncFileDto);
        return entry;
      }
    } else if(method === 'download') {
      const fileContent = await this.fileService.findFileContent(fileId);
      // res.
      return fileContent.bodyString;

    } else if(method === 'delete') {

    } else {
      throw new BadRequestException();
    }
  }
}
