import { IsNumber, IsString } from "class-validator";

export class CreateStudentDto {

  @IsString()
  userId: string;

  @IsString()
  level: string;

  @IsNumber()
  grade: number;

  @IsString()
  section: string;

}
