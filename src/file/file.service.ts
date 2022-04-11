import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { Model } from 'mongoose';
import { FileContent } from './entities/fileContent.entity';
import { SyncFileDto } from './dto/sync-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
    @InjectModel(FileContent.name)
    private readonly fileContentModel: Model<FileContent>,
  ) {}

  create(createFileDto: CreateFileDto) {
    const file = new this.fileModel(createFileDto);
    return file.save();
  }

  async findAll(userId?: string, parentId?: string) {
    // console.log(userId);
    const files = await this.fileModel
      .find({ userId, parentId }, { _id: 0 })
      .exec();
    if (!files) {
      throw new NotFoundException(`files not found`);
    }
    return files;
  }

  async findAllDir(userId?: string, parentId?: string) {
    const files = await this.fileModel
      .find({ userId, parentId, dir: true }, { _id: 0 })
      .exec();
    if (!files) {
      throw new NotFoundException(`files not found`);
    }
    return files;
  }

  async findRoot(userId: string) {
    const file = await this.fileModel
      .findOne({ userId, parentId: null }, { _id: 0 })
      .exec();
    if (!file) {
      throw new NotFoundException(`user not found`);
    }
    return file;
  }

  async findOne(id: string) {
    const file = await this.fileModel
      .findOne({ fileId: id }, { _id: 0 })
      .exec();
    if (!file) {
      throw new NotFoundException(`File #${id} not found`);
    }
    return file;
  }

  async update(id: string, updateFileDto: UpdateFileDto) {
    const existingFile = await this.fileModel
      .findOneAndUpdate({ _id: id }, { $set: updateFileDto }, { new: true })
      .exec();
    if (!existingFile) {
      throw new NotFoundException(`File #${id} not found`);
    }
    return existingFile;
    // return `This action updates a #${id} file`;
  }

  async remove(id: string) {
    const directory = await this.findOne(id);
    return directory.remove();
    // return `This action removes a #${id} file`;
  }

  async findFileContent(id: string) {
    const fileContent = await this.fileContentModel.findOne({ fileId: id });
    if(!fileContent) {
      throw new NotFoundException(`File content not found`);
    }
    return fileContent;
  }

  async updateFileContent(id: string, syncFileDto: SyncFileDto) {
    console.log(syncFileDto);
    const existingFile = await this.fileContentModel
      .findOneAndUpdate({ fileId: id }, { $set: syncFileDto }, { new: true })
      .exec();
    if (!existingFile) {
      throw new NotFoundException(`File content not found`);
    }
    return existingFile;
  }

  async createFileContent(id: string, createFileDto: SyncFileDto) {
    
    const fileContent = await this.fileContentModel.findOne({ fileId: id });
    if(fileContent) {
      return new BadRequestException(`file already exist`);
    }
    
    // if(fileContent) {
    //   return new BadRequestException(`file already exist`);
    // }
    
    const syncFile = new this.fileContentModel(createFileDto);
    return syncFile.save();
    
    // const syncFile = new FileContent(createFileDto);
    // return syncFile.save()
  }
}
