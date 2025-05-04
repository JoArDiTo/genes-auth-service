import { PartialType } from "@nestjs/mapped-types";
import { RegisterUserDto } from "./register-user.dto";
import { IsString } from "class-validator";

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsString()
  token: string;
}
