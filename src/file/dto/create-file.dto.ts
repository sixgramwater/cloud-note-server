import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateFileDto {
  @IsString()
  name: string;

  @IsString()
  parentId: string;

  @IsString()
  @IsUUID()
  fileId: string;

  @IsBoolean()
  dir: boolean;

  @IsOptional()
  @IsString()
  bodyString?: string;

  @IsOptional()
  @IsString()
  userId?: string;
  // WEB865d07d6b0bebdb6346256d0152f4e38
  // WEBabf8f0a2b37b3002b3e9974829881252
  //    90C587723DCE4D999DA8329A7E36C8E4
}
