import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PayrollService } from './payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private svc: PayrollService) {}

  @Get('generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  generate(@Query('month') month: string) {
    return this.svc.generateMonthlyPayroll(month);
  }
}
