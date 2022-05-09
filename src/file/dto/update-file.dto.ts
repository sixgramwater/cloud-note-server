import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
import { CreateFileDto } from './create-file.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {
  @IsString()
  @IsUUID()
  fileId: string;

  @IsBoolean()
  shared?: boolean;

  @IsBoolean()
  bloged?: boolean;

  @IsBoolean()
  star?: boolean;
}
