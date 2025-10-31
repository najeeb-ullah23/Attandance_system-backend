import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leave } from './schemas/leave.schema';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class LeaveService {
  constructor(@InjectModel(Leave.name) private leaveModel: Model<Leave>, private audit: AuditService) {}

  async apply(employeeId: string, payload: Partial<Leave>) {
    const leave = await this.leaveModel.create({ employeeId, ...payload, status: 'pending' });
    await this.audit.log(employeeId, 'leave_apply', { leaveId: leave._id });
    return leave;
  }

  async approve(leaveId: string, adminId: string) {
    const leave = await this.leaveModel.findById(leaveId);
    if (!leave) throw new NotFoundException('Leave not found');
    leave.status = 'approved';
    await leave.save();
    await this.audit.log(adminId, 'leave_approve', { leaveId });
    return leave;
  }

  async reject(leaveId: string, adminId: string) {
    const leave = await this.leaveModel.findById(leaveId);
    if (!leave) throw new NotFoundException('Leave not found');
    leave.status = 'rejected';
    await this.audit.log(adminId, 'leave_reject', { leaveId });
    return leave;
  }

  async myLeaves(empId: string) {
    return this.leaveModel.find({ employeeId: empId }).sort({ createdAt: -1 });
  }

  async allLeaves() {
    return this.leaveModel.find().populate('employeeId');
  }
}
