import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaClient, Role } from 'generated/prisma';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StudentService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createStudentDto: CreateStudentDto) {
    const { userId } = createStudentDto;
    
    const userExists = await this.user.findUnique({ where: { id: userId } });

    if (!userExists) throw new RpcException({
      status: 400,
      message: `User with id ${ userId } does not exist`
    })

    if (userExists.role !== Role.STUDENT) throw new RpcException({
      status: 400,
      message: `User with id ${ userId } is not a student`
    })

    const studentExists = await this.student.findUnique({ where: { userId: userId } });

    if (studentExists) throw new RpcException({
      status: 400,
      message: `Student with id ${ userId } already exists`
    })

    return this.student.create({
      data: { ...createStudentDto }
    });
  }

  async findAll() {
    const users = await this.user.findMany({
      select: { id:true, documentId:true, firstname:true, lastname:true, age:true, gender:true, email:true, phoneNumber:true, imageUrl:true },
      where: { role: Role.STUDENT }
    });
    const students = await this.student.findMany({ select: { id:true, userId:true, level:true, grade:true, section:true } });

    return users.map(user => {
      const student = students.find(student => student.userId === user.id);
      const { userId:_, ...studentData } = student || {}
        return {
          user,
          student: studentData
        }
    })
  }

  async findOne(id: string) {
    const student = await this.student.findUnique({ 
      select: { id:true, userId:true, level:true, grade:true, section:true },
      where: { id: id }
    });

    if (!student) throw new RpcException({
      status: 400,
      message: `Student with id ${ id } does not exist`
    })
    
    const user = await this.user.findUnique({
      select: { id:true, documentId:true, firstname:true, lastname:true, age:true, gender:true, email:true, phoneNumber:true, imageUrl:true },
      where: { id: student.userId }
    });

    const { userId:_, ...studentData } = student

    return {
      user,
      student: studentData
    };
  }

  async findByStudentId(id: string) {
    const student = await this.student.findUnique({ where: { id: id } });

    if (!student) throw new RpcException({
      status: 400,
      message: `Student with id ${ id } does not exist`
    })

    const user = await this.user.findUnique({ where: { id: student.userId } });

    return { ...student, ...user };
  }
}
