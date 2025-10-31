import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { AttendanceModule } from 'src/attendance/attendance.module';

@Module({
  imports: [forwardRef(() => AuthModule),MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
   AttendanceModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
