import { IsOptional, IsString } from "class-validator";

export class RegisterDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly avatarUrl: string;

  @IsString()
  @IsOptional()
  readonly nickname: string;
}