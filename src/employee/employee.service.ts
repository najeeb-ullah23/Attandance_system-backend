import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './employee.schema';
import { successResponse, errorResponse } from '../common/utils/response.util';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) {}

async create(data: any): Promise<Employee> {
  try {
    const employee = new this.employeeModel(data);
    return await employee.save();
  } catch (err) {
    console.error('❌ Employee save error:', err.message);
    throw err;
  }
}


  async findAll() {
    try {
      const all = await this.employeeModel.find().exec();
      return successResponse('All employees fetched', all);
    } catch (error) {
      return errorResponse('Failed to fetch employees', error.message);
    }
  }

  async findOne(id: string) {
    try {
      const emp = await this.employeeModel.findById(id).exec();
      return emp
        ? successResponse('Employee found', emp)
        : errorResponse('Employee not found');
    } catch (error) {
      return errorResponse('Failed to fetch employee', error.message);
    }
  }

  async update(id: string, data: any) {
    try {
      const updated = await this.employeeModel
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
      return updated
        ? successResponse('Employee updated', updated)
        : errorResponse('Employee not found');
    } catch (error) {
      return errorResponse('Failed to update employee', error.message);
    }
  }

  async delete(id: string) {
    try {
      const deleted = await this.employeeModel.findByIdAndDelete(id).exec();
      return deleted
        ? successResponse('Employee deleted', deleted)
        : errorResponse('Employee not found');
    } catch (error) {
      return errorResponse('Failed to delete employee', error.message);
    }
  }
}
