import { Injectable, OnModuleInit } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  
  constructor(private readonly jwtService: JwtService){
    super();
  }
  
  async register(registerUserDto: RegisterUserDto) {
    const { email, documentId, password } = registerUserDto;

    const existingUser = await this.user.findFirst({
      where: { OR: [
        { email: email },
        { documentId: documentId }
      ]}
    });

    if (existingUser) {
      const conflicField = existingUser.email === email ? 'email' : 'document_id';
      
      throw new RpcException({
        status: 400,
        message: `The ${conflicField} ${existingUser[conflicField]} already exists`,
      });
    }
  
    const newUser = await this.user.create({
      data: {
        ...registerUserDto,
        password: bcrypt.hashSync(password, envs.saltRounds)
      }
    })
    
    return newUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const exist = await this.user.findUnique({ where: { email: email }});
    if (!exist) throw new RpcException({
      status: 400,
      message: 'User is not registered'
    });

    const isPasswordValid = bcrypt.compareSync(password, exist.password);
    if (!isPasswordValid) throw new RpcException({
      status: 400,
      message: 'Password is incorrect'
    });

    const user = { id: exist.id, firstname: exist.firstname, email: exist.email, role: exist.role };

    return { 
      user: user,
      token: this.signJwt(user)
    };
  }

  async verify(token: string) {
    try {
      const { sub:_, iat:__, exp:___, ...user } = this.jwtService.verify(token, { secret: envs.jwtSecret });

      return user;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async getProfile(token: string) {
    const { id } = this.jwtService.verify(token, { secret: envs.jwtSecret });

    //@ts-ignore
    const { password:_, ...exist } = await this.user.findUnique({ where: { id: id }});

    return exist;
  }

  async update(token:string, updateUserDto: UpdateUserDto) {
    const { id } = this.jwtService.verify(token, { secret: envs.jwtSecret });
    const { token:_, password:__, role:___, ...data } = updateUserDto;
    
    const userModified = await this.user.update({ where: { id }, data: data })
    const { password:____, ...exist} = userModified

    return exist
  }

  signJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
