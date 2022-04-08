import { IsString, isString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;
}
