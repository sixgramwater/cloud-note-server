import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      .find({ userId, parentId, deleted: false }, { _id: 0, deleted: 0 })
      .exec();
    if (!files) {
      throw new NotFoundException(`files not found`);
    }
    return files;
  }

  async findAllWithoutErrorHandle(userId?: string, parentId?: string) {
    // console.log(userId);
    const files = await this.fileModel
      .find({ userId, parentId, deleted: false }, { _id: 0, deleted: 0 })
      .exec();
    return files;
  }

  async deleteMany(ids: string[]) {
    const deleted = await this.fileModel.updateMany(
      {
        fileId: {
          $in: ids,
        },
      },
      { $set: { deleted: true } },
    );
    return deleted;
  }
  async findUsersAll(userId: string) {
    const files = await this.fileModel
      .find({ userId, deleted: false }, { _id: 0, deleted: 0 })
      .exec();
    if (!files) {
      throw new NotFoundException(`files not found`);
    }
    return files;
  }

  async findAllDir(userId?: string, parentId?: string) {
    const files = await this.fileModel
      .find(
        { userId, parentId, dir: true, deleted: false },
        { _id: 0, deleted: 0 },
      )
      .exec();
    if (!files) {
      throw new NotFoundException(`files not found`);
    }
    return files;
  }

  async findRoot(userId: string) {
    const file = await this.fileModel
      .findOne({ userId, parentId: null }, { _id: 0, deleted: 0 })
      .exec();
    if (!file) {
      throw new NotFoundException(`user not found`);
    }
    return file;
  }

  async findOne(id: string) {
    const file = await this.fileModel
      .findOne({ fileId: id, deleted: false }, { _id: 0, deleted: 0 })
      .exec();
    if (!file) {
      throw new NotFoundException(`File #${id} not found`);
    }
    return file;
  }

  async search(userId: string, keywords: string) {
    const reg = new RegExp(keywords, 'i');
    const files = await this.fileModel.find({ name: reg, userId, deleted: false }, { _id: 0, deleted: 0 }).exec();
    return files;
  }

  async update(id: string, updateFileDto: UpdateFileDto) {
    const existingFile = await this.fileModel
      .findOneAndUpdate(
        { fileId: id, deleted: false },
        { $set: updateFileDto },
        { new: true },
      )
      .exec();
    if (!existingFile) {
      throw new NotFoundException(`File #${id} not found`);
    }
    return existingFile;
    // return `This action updates a #${id} file`;
  }

  // async findAndDelete(id: string, parentId: string) {

  // }

  async remove(id: string) {
    const directory = await this.findOne(id);
    return directory.remove();
    // return `This action removes a #${id} file`;
  }

  async findFileContent(id: string) {
    const fileContent = await this.fileContentModel.findOne({ fileId: id });
    if (!fileContent) {
      throw new NotFoundException(`File content not found`);
    }
    return fileContent;
  }

  async updateFileContent(id: string, syncFileDto: SyncFileDto) {
    // console.log(syncFileDto);
    const { bodyString } = syncFileDto;
    const existingFile = await this.fileContentModel
      .findOneAndUpdate({ fileId: id }, { $set: { bodyString } }, { new: true })
      .exec();
    if (!existingFile) {
      throw new NotFoundException(`File content not found`);
    }
    return existingFile;
  }

  async createFileContent(id: string, createFileDto: SyncFileDto) {
    const fileContent = await this.fileContentModel.findOne({ fileId: id });
    if (fileContent) {
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
