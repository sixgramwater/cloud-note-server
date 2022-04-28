import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDirectoryDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumber()
  type: number;

  @IsOptional()
  @IsNumber()
  updated: number;
  // @IsBoolean()
  // readonly isDirectory: boolean;


}
