import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payroll extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  month: string; // e.g. "October 2025"

  @Prop({ required: true })
  baseSalary: number;

  @Prop({ default: 0 })
  overtimeHours: number;

  @Prop({ default: 0 })
  overtimePay: number;

  @Prop({ default: 0 })
  deductions: number;

  @Prop({ default: 0 })
  bonuses: number;

  @Prop({ required: true })
  netSalary: number;

  @Prop({ default: 'Pending', enum: ['Pending', 'Paid'] })
  status: string;

  @Prop()
  paymentDate?: Date;
}

export const PayrollSchema = SchemaFactory.createForClass(Payroll);
