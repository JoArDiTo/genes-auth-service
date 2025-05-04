import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'auth.register' })
  register(@Payload() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @MessagePattern({ cmd: 'auth.login' })
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @MessagePattern({ cmd: 'auth.verify.token' })
  verify(@Payload() token: string) {
    return this.userService.verify(token);
  }

  @MessagePattern({ cmd: 'auth.profile' })
  getProfile(@Payload() token: string) {
    return this.userService.getProfile(token);
  }
  
  @MessagePattern({ cmd: 'auth.update.user' })
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.token, updateUserDto);
  }
}
