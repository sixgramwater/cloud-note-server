import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsOptional()
  @IsString()
  directoryId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsNumber()
  type: number;
}
