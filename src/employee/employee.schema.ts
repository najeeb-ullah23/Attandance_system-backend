// src/employee/employee.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Employee extends Document {
  static fullName(fullName: any): (target: typeof import("./employee.service").EmployeeService, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error('Method not implemented.');
  }
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

   @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  department: string;

  @Prop()
  profileImage: string;

  @Prop({ default: 'Employee' })
  position: string;

  @Prop({ default: 'Active' })
  status: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
