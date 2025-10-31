import { Controller, Post, UseGuards, Req, Body, Get, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceservice: AttendanceService) {}

  @Post('checkin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employee', 'admin')
  async checkIn(@Req() req, @Body() body: { geo?: any }) {
    return this.attendanceservice.checkIn(req.user.userId, body?.geo);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employee', 'admin')
  async checkOut(@Req() req) {
    return this.attendanceservice.checkOut(req.user.userId);
  }

  
 @Get('attendancehistory')
@UseGuards(JwtAuthGuard)
async myAttendance(@Req() req, @Query('month') month: string) {
  const selectedMonth = month || new Date().toISOString().slice(0, 7);
  return this.attendanceservice.getMonthlyAttendance(req.user.userId, selectedMonth);
}


}
