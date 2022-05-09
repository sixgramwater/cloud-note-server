import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from './upload.service';

// const upload = multer({dest:'../uploads'}).single("single");

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService
  ) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: '../upload',
      // storage:
      // storage:
      // storage: multer.diskStorage({
      //   filename: (req, file, cb) => {
      //     const ext = file.originalname.split('.').pop();
      //     cb(null, file.filename+'.'+ext);
      //   }
      // })
      // fileFilter: (req, file) => file.mimetype.includes('image'),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log(process.env.NODE_ENV);
    const fileInfo = {
      originalname: file.originalname,
      type: file.mimetype,
      filename: file.filename,
      url: `https://static.cloudwhite.xyz/${file.filename}`,
      size: file.size,

    };
    await this.uploadService.create(fileInfo);

    return fileInfo;
  }
}
