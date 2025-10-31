import { Injectable } from '@nestjs/common';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Attendance.name) private attModel: Model<Attendance>) {}

  async monthlyReportForEmployee(employeeId: string, month: string) {
    return this.attModel.find({ employeeId, date: { $regex: `^${month}` } }).sort({ date: 1 });
  }

  async attendanceSummaryForMonth(month: string) {
    return this.attModel.aggregate([
      { $match: { date: { $regex: `^${month}` } } },
      {
        $group: {
          _id: '$employeeId',
          daysPresent: { $sum: 1 },
          lateCount: { $sum: { $cond: ['$isLate', 1, 0] } },
        },
      },
    ]);
  }
}
