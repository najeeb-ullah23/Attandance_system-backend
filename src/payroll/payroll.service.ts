import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payroll } from './schema/payroll.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class PayrollService {
  constructor(
    @InjectModel(Payroll.name) private payrollModel: Model<Payroll>,
    private readonly usersService: UsersService,
  ) {}

  async generateMonthlyPayroll(month: string) {
    const employees = await this.usersService.findAll();
    const users = await this.usersService.findAll();

    const payrolls = [];
    for (const emp of employees) {
      const baseSalary =  50000;
      const netSalary = baseSalary; // here you can apply logic for attendance

      const payroll = new this.payrollModel({
        employeeId: emp._id,
        month,
        baseSalary,
        netSalary,
        status: 'Pending',
      });

      await payroll.save();
      payrolls.push(payroll);
    }

    return payrolls;
  }

  async markAsPaid(id: string) {
    return this.payrollModel.findByIdAndUpdate(id, { status: 'Paid', paymentDate: new Date() }, { new: true });
  }

  async findAll() {
    return this.payrollModel.find().populate('employeeId');
  }
}
