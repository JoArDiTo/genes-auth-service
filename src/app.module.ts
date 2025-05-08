import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [UserModule, StudentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
