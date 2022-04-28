import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { Directory } from './entities/directory.entity';
import { Model } from 'mongoose';


@Injectable()
export class DirectoryService {
  constructor(
    @InjectModel(Directory.name)  private readonly directoryModel: Model<Directory> 
  ) {}

  async create(createDirectoryDto: CreateDirectoryDto) {
    const directory = new this.directoryModel(createDirectoryDto);
    return directory.save();
  }

  async createByParentId(parentId: string, createDirectoryDto: CreateDirectoryDto) {

    const directory = new this.directoryModel(createDirectoryDto);
    const existingDirectory = await this.directoryModel
      .findOne({ _id: parentId});
    if(!existingDirectory) {
      throw new NotFoundException(`Directory #${parentId} not found`);
    } else if(existingDirectory.type !== 0) {
      throw new NotFoundException(`can only insert into directory!`)
    }
    await this.directoryModel.updateOne({_id: parentId}, { $addToSet: { childList: directory } })
    return directory;


    // const existingDirectory = await this.directoryModel
    //   .findOneAndUpdate({ _id: parentId }, { $addToSet: { childList: directory } })
    //   .exec();
    // if(!existingDirectory) {
    //   throw new NotFoundException(`Directory #${parentId} not found`);

    // }
    // return directory;
  }

  async insertByParentId(parentId: string, createDirectoryDto: CreateDirectoryDto & {_id: any}) {

    const directory = new this.directoryModel(createDirectoryDto,{},true);
    const existingDirectory = await this.directoryModel
      .findOne({ _id: parentId});
    if(!existingDirectory) {
      throw new NotFoundException(`Directory #${parentId} not found`);
    } else if(existingDirectory.type !== 0) {
      throw new NotFoundException(`can only insert into directory!`)
    }
    await this.directoryModel.updateOne({_id: parentId}, { $addToSet: { childList: directory } })
    return directory;
  }
  // async insertByParentId(parentId: string, )

  async findAll(userId?: string) {
    const directorys = await this.directoryModel.find({ userId }).exec();
    if(!directorys) {
      throw new NotFoundException(`directorys not found`);
    }
    return directorys;
  }

  async findOne(id: string) {
    const directory = await this.directoryModel.findOne({ _id: id}).exec();
    if(!directory) {
      throw new NotFoundException(`Directory #${id} not found`);
    }
    return directory;
    // return `This action returns a #${id} directory`;
  }

  async update(id: string, updateDirectoryDto: UpdateDirectoryDto) {
    const existingDirectory = await this.directoryModel
      .findOneAndUpdate({ _id: id }, { $set: updateDirectoryDto }, { new: true })
      .exec()
    if(!existingDirectory) {
      throw new NotFoundException(`Directory #${id} not found`);
    }
    return existingDirectory;
  }

  async remove(id: string) {
    const directory = await this.findOne(id);
    return directory.remove();
    // return `This action removes a #${id} directory`;
  }
}
