import { IsEmail, IsString, IsUrl, MinLength, MaxLength } from "class-validator";

export class RegisterUserDto {
  
  @IsString()
  documentId: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;
  
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(65)
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  phoneNumber: string;

  @IsUrl()
  imageUrl: string;
}