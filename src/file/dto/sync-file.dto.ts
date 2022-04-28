import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateFileDto } from './create-file.dto';

export class SyncFileDto extends PartialType(CreateFileDto) {
  @IsString()
  @IsUUID()
  fileId: string;

  // @IsOptional()
  @IsString()
  bodyString: string;

  // @IsOptional()
  // @IsString()
  // parentId?: string;

  // @IsOptional()
  // @IsNumber()
  // modifyTime?: number;

  // @IsOptional()
  // @IsString()
  // name?: string;

  // @IsOptional()
  // @IsBoolean()
  // dir?: boolean;

  // @IsOptional()
  // @IsNumber()
  // type?: number;
}
