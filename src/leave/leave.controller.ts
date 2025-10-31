import { Controller, Post, UseGuards, Req, Body, Patch, Param, Get } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('leave')
export class LeaveController {
  constructor(private svc: LeaveService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  async apply(@Req() req, @Body() body: any) {
    return this.svc.apply(req.user.userId, body);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async my(@Req() req) {
    return this.svc.myLeaves(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async all() {
    return this.svc.allLeaves();
  }

  @Patch('approve/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approve(@Req() req, @Param('id') id: string) {
    return this.svc.approve(id, req.user.userId);
  }

  @Patch('reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async reject(@Req() req, @Param('id') id: string) {
    return this.svc.reject(id, req.user.userId);
  }
}
