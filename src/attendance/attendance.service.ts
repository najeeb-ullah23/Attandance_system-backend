import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from './schemas/attendance.schema';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AttendanceService {
   async getTodayAttendance(employeeId: string) {
    const date = this.getTodayDate();
    return this.attendanceModel.findOne({ employeeId, date });
  }

  async getAttendanceHistory(employeeId: string) {
    return this.attendanceModel.find({ employeeId }).sort({ date: -1 });
  }
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    private audit: AuditService,
  ) {}

  private getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ✅ CHECK IN
  async checkIn(employeeId: string, geo?: any) {
    const date = this.getTodayDate();
    let record = await this.attendanceModel.findOne({ employeeId, date });

    if (record && record.checkInTimestamp && !record.checkOutTimestamp) {
      throw new BadRequestException(
        'You are already checked in. Please check out first.',
      );
    }

const now = new Date();
const time = now.toTimeString().split(' ')[0];
const isLate = now.getHours() > 19 || (now.getHours() === 19 && now.getMinutes() > 15);

    const recordData = {
      checkIn: time,
      checkInTimestamp: now,
      isLate,
      geo,
      isAbsent: false,
      checkOut: null,
      checkOutTimestamp: null,
    };

    if (record) {
      Object.assign(record, recordData);
    } else {
      record = new this.attendanceModel({
        employeeId,
        date,
        ...recordData,
      });
    }

    await record.save();
    await this.audit.log(employeeId, 'checkin', { date, time });
    return record;
  }

  // ✅ CHECK OUT
  async checkOut(employeeId: string) {
    const date = this.getTodayDate();
    const attendance = await this.attendanceModel.findOne({ employeeId, date });

    if (!attendance) throw new BadRequestException('No attendance record found for today.');
    if (!attendance.checkInTimestamp) throw new BadRequestException('You have not checked in yet.');
    if (attendance.checkOutTimestamp) throw new BadRequestException('You have already checked out.');

    const now = new Date();
    const time = now.toTimeString().split(' ')[0];

    attendance.checkOut = time;
    attendance.checkOutTimestamp = now;

    await attendance.save();
    await this.audit.log(employeeId, 'checkout', { date, time });
    return attendance;
  }

  // ✅ MONTHLY ATTENDANCE REPORT
  async getMonthlyAttendance(employeeId: string, month: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const lastDay = new Date(year, monthNum, 0).getDate();

    const startDate = `${month}-01`;
    const endDate = `${month}-${lastDay}`;

    const records = await this.attendanceModel
      .find({
        employeeId,
        date: { $gte: startDate, $lte: endDate },
      })
      .populate('employeeId')
      .sort({ date: 1 });

    const allDates = Array.from({ length: lastDay }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return `${month}-${day}`;
    });

    const toMinutes = (time: string) => {
      if (!time) return 0;
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    let totalCheckIn = 0;
    let totalCheckOut = 0;
    let totalWorkingMinutes = 0;
    let presentCount = 0;
    let lateCount = 0;

    const attendance = allDates.map((date) => {
      const record = records.find((r) => r.date === date);
      let status = 'Absent';
      let workHours = 0;

      if (record) {
        status = 'Present';
        presentCount++;
        if (record.isLate) lateCount++;

        if (record.checkIn && record.checkOut) {
          const diff = toMinutes(record.checkOut) - toMinutes(record.checkIn);
          workHours = diff / 60;
          totalWorkingMinutes += diff;
        }

        if (record.checkIn) totalCheckIn += toMinutes(record.checkIn);
        if (record.checkOut) totalCheckOut += toMinutes(record.checkOut);
      }

      return {
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        checkIn: record?.checkIn || null,
        checkOut: record?.checkOut || null,
        workingHours: workHours ? workHours.toFixed(2) + ' hrs' : null,
        status,
        location: record?.address || null,
      };
    });

    // Helper to format minutes back to HH:mm
    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60)
        .toString()
        .padStart(2, '0');
      const m = Math.floor(mins % 60)
        .toString()
        .padStart(2, '0');
      return `${h}:${m}`;
    };

    // Averages
    const avgCheckIn = presentCount > 0 ? totalCheckIn / presentCount : 0;
    const avgCheckOut = presentCount > 0 ? totalCheckOut / presentCount : 0;
    const avgWorkHours =
      presentCount > 0 ? (totalWorkingMinutes / presentCount / 60).toFixed(2) : '0';

    const summary = {
      totalDays: lastDay,
      presentDays: presentCount,
      absentDays: lastDay - presentCount,
      lateDays: lateCount,
      attendanceRate: ((presentCount / lastDay) * 100).toFixed(1) + '%',
      averageCheckIn: formatTime(avgCheckIn),
      averageCheckOut: formatTime(avgCheckOut),
      averageWorkingHours: avgWorkHours + ' hrs',
    };

    return {
      employeeId,
   employeeName: (records[0]?.employeeId as any)?.fullName || null,
      month,
      summary,
      attendance,
    };
  }
}
