import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { ShiftsModule } from './shifts/shifts.module';
import { ReportsModule } from './reports/reports.module';
import { PayrollModule } from './payroll/payroll.module';
import { AuditModule } from './audit/audit.module';
import { EmployeeModule } from './employee/employee.module';
import { DatabaseConfig } from './config/database.config';
import { CompanyModule } from './company/company.module';
import { IpWhitelistMiddleware } from './middleware/ip-whitelist.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
     MongooseModule.forRootAsync({
      useFactory: DatabaseConfig,
    }),
    AuthModule,
    UsersModule,
    EmployeeModule,
    AttendanceModule,
    LeaveModule,
    ShiftsModule,
    ReportsModule,
    PayrollModule,
    AuditModule,
    CompanyModule,
  ],
})
export class AppModule implements NestModule { 
configure(consumer: MiddlewareConsumer) {
  if (process.env.NODE_ENV === 'production') {
    consumer
      .apply(IpWhitelistMiddleware)
      .exclude(
        'auth/register',
        'auth/login',
        'auth/refresh-token',
        'attendance/checkin', 
        'attendance/checkout',
        'attendance/me',
        'leave/apply',
        'leave/my'
      )
      .forRoutes('*');
  }
}


}
