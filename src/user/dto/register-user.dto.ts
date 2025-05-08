import { IsEmail, IsString, IsUrl, MinLength, MaxLength, Min, IsNumber, IsOptional, IsEnum } from "class-validator";
import { Role } from "generated/prisma";

export class RegisterUserDto {
  
  @IsString()
  documentId: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsNumber()
  @Min(1)
  age: number

  @IsString()
  gender: string;
  
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

  @IsOptional()
  @IsEnum(Role, { message: 'role must be either STUDENT or TEACHER' })
  role: Role = Role.STUDENT;
}