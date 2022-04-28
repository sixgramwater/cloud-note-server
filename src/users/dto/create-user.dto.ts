import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly avatarUrl?: string;

  @IsOptional()
  @IsString()
  readonly nickname?: string;
}
