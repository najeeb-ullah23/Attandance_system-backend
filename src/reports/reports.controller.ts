import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @Get('employee/:id/monthly')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  monthlyForEmployee(@Param('id') id: string, @Query('month') month: string) {
    return this.svc.monthlyReportForEmployee(id, month);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  summary(@Query('month') month: string) {
    return this.svc.attendanceSummaryForMonth(month);
  }
}
