import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Upload } from './entities/upload.entity';
import { Model } from 'mongoose';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name) private readonly uploadModel: Model<Upload>,
  ) {}

  async create(createUploadDto) {
    const upload = new this.uploadModel(createUploadDto);
    return upload.save();
  }
}
