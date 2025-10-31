import { Controller, Post, Body, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('shifts')
export class ShiftsController {
  constructor(private svc: ShiftsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  list() {
    return this.svc.list();
  }

  @Patch(':id/assign/:empId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  assign(@Param('id') id: string, @Param('empId') empId: string) {
    return this.svc.assignToEmployee(id, empId);
  }
}
