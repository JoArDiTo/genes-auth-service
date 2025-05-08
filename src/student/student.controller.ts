import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @MessagePattern({ cmd: 'auth.register.student' })
  create(@Payload() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @MessagePattern({ cmd: 'auth.all.students' })
  findAll() {
    return this.studentService.findAll();
  }

  @MessagePattern({ cmd: 'auth.one.student' })
  findOne(@Payload() id: string){
    return this.studentService.findOne(id)
  }
}
