import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Leave, LeaveSchema } from './schemas/leave.schema';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Leave.name, schema: LeaveSchema }]), AuditModule],
  providers: [LeaveService],
  controllers: [LeaveController],
})
export class LeaveModule {}
