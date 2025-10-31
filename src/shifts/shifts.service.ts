import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shift } from './schemas/shift.schema';

@Injectable()
export class ShiftsService {
  constructor(@InjectModel(Shift.name) private shiftModel: Model<Shift>) {}

  async create(payload: Partial<Shift>) {
    return this.shiftModel.create(payload);
  }

  async assignToEmployee(shiftId: string, employeeId: string) {
    return this.shiftModel.findByIdAndUpdate(shiftId, { employeeId }, { new: true });
  }

  async list() {
    return this.shiftModel.find();
  }
}
