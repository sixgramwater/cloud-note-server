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
  UnauthorizedException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { AuthGuard } from '@nestjs/passport';
import { SyncFileDto } from './dto/sync-file.dto';
import { StarFileDto } from './dto/star-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // listPath
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createFileDto: CreateFileDto, @Req() req) {
    const { userId } = req.user;
    createFileDto.userId = userId;
    const { fileId, type } = createFileDto;
    if (type === 1 || type === 2) {
      const createFileContentDto = {
        fileId,
        bodyString: '',
        userId,
      };
      await this.fileService.createFileContent(fileId, createFileContentDto);
    }
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
  @Get('star')
  async getStar(@Req() req) {
    const { userId } = req.user;
    const entries = await this.fileService.findUsersAll(userId);
    // console.log(entries);
    // return entries;
    const files = entries.filter((entry) => entry.star);
    files.sort((a, b) => b.updated - a.updated);
    return files;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('bloged')
  async getBlog(@Req() req) {
    const { userId } = req.user;
    const entries = await this.fileService.findUsersAll(userId, {
      bloged: true
    });
    // console.log(entries);
    // return entries;
    // const files = entries.filter((entry) => entry.bloged);
    const files = entries;
    files.sort((a, b) => b.updated - a.updated);
    return files;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('shared')
  async getShared(@Req() req) {
    const { userId } = req.user;
    const entries = await this.fileService.findUsersAll(userId, {
      shared: true
    });
    // console.log(entries);
    // console.log(entries);
    // return entries;
    // const files = entries.filter((entry) => entry.shared);
    // console.log(files);
    
    const files = entries;
    files.sort((a, b) => b.updated - a.updated);
    return files;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('recent')
  async getRecent(@Req() req) {
    const { userId } = req.user;
    const entries = await this.fileService.findUsersAll(userId);
    // console.log(entries);
    // return entries;
    const files = entries.filter((entry) => !entry.dir);
    files.sort((a, b) => b.updated - a.updated);
    return files;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  async search(@Query() query, @Req() req) {
    const { keywords } = query;
    const { userId } = req.user;
    // console.log(keywords)
    const files = await this.fileService.search(userId, keywords);
    return files;
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
      const page = await this.fileService.findAll(userId, id);
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

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const { userId } = req.user;
    const entryItem = await this.fileService.findOne(id);
    if (entryItem) {
      const { userId: rightUserId, dir } = entryItem;
      if (userId !== rightUserId) {
        console.log([userId, rightUserId]);
        throw new UnauthorizedException('没有权限删除该文件');
      }
      if (dir) {
        const idList = [];
        idList.push(id);
        let queue = [];
        queue.push(id);
        while (queue.length !== 0) {
          const parentId = queue.pop();
          const entries = await this.fileService.findAllWithoutErrorHandle(
            userId,
            parentId,
          );
          if (entries) {
            entries.forEach((entry) => {
              idList.push(entry.fileId);
              if (entry.dir) {
                queue.push(entry.fileId);
              }
            });
          }
        }
        console.log(idList);
        const deletedFiles = this.fileService.deleteMany(idList);
        if (deletedFiles) {
          return deletedFiles;
        } else {
          throw new NotFoundException();
        }
        // while(idList.)
      } else {
        const updateFileDto = {
          fileId: id,
          deleted: true,
        } as any;
        this.fileService.update(id, updateFileDto);
      }
    } else {
      throw new NotFoundException();
    }
    // const
    // return this.fileService.remove(id);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('star')
  // async getStar(@Req() req) {
  //   const { userId } = req.user;
  //   const entries = await this.fileService.findAll(userId);
  //   const files = entries.filter(entry=>!entry.dir);
  //   files.sort((a, b) => a.updated - b.updated);
  //   return files;
  // }

  @UseGuards(AuthGuard('jwt'))
  @Post('star')
  async star(@Body() starFileDTO: StarFileDto, @Req() req) {
    const { userId } = req.user;
    const { star, fileId } = starFileDTO;
    const entry = await this.fileService.findOne(fileId);
    if (entry) {
      const { fileId: rightFileId } = entry;
      if (rightFileId !== fileId) throw new UnauthorizedException();
      return await this.fileService.update(fileId, { fileId, star });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sync')
  async sync(@Body() syncFileDto: SyncFileDto, @Req() req, @Query() query) {
    const { userId } = req.user;
    const { fileId } = syncFileDto;
    const { method } = query;
    if (!method) {
      throw new BadRequestException();
    } else if (method === 'push') {
      // const { bodyString, name, fileId, parentId } = syncFileDto;
      const { bodyString, fileId } = syncFileDto;

      const entry = await this.fileService.findOne(fileId);
      if (!entry) {
        throw new NotFoundException();
      }
      const { userId: rightUserId } = entry;
      if (userId !== rightUserId)
        throw new UnauthorizedException('没有权限修改');
      const syncFile = {
        fileId,
        bodyString,
        userId,
      };
      return await this.fileService.updateFileContent(fileId, syncFile);
      // // 第一次创建
      // if(name) {
      //   syncFileDto.userId = userId;
      //   if(!parentId  || !fileId)  throw new BadRequestException();
      //   const createDto = syncFileDto as CreateFileDto;
      //   const entry = await this.fileService.create(createDto);
      //   try{
      //     await this.fileService.createFileContent(fileId, syncFileDto);

      //   } catch(err) {
      //     console.log(err);
      //   }
      //   return entry;
      // } else {
      //   // 更新
      //   const entry = await this.fileService.findOne(fileId);
      //   if(!entry) {
      //     throw new NotFoundException();
      //   }
      //   await this.fileService.updateFileContent(fileId, syncFileDto);
      //   return entry;
      // }
    } else if (method === 'download') {
      const fileContent = await this.fileService.findFileContent(fileId);
      // res.
      return fileContent.bodyString;
    } else if (method === 'delete') {
    } else {
      throw new BadRequestException();
    }
  }
}
