import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(65)
  password: string;
}