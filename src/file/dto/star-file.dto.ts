import { IsBoolean, IsUUID } from "class-validator";

export class StarFileDto {
  @IsUUID()
  fileId: string;

  @IsBoolean()
  star: boolean;
}