import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateFileDto } from './create-file.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {
  @IsString()
  @IsUUID()
  fileId: string;

  @IsOptional()
  @IsBoolean()
  shared?: boolean;

  @IsOptional()
  @IsBoolean()
  bloged?: boolean;

  @IsOptional()
  @IsBoolean()
  star?: boolean;
}
