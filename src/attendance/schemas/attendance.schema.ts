import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Attendance extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  employeeId: string;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop()
  checkIn?: string; // HH:mm:ss

  @Prop()
  checkOut?: string;

    @Prop()
  address?: string;

   @Prop({ type: Date }) 
  checkInTimestamp: Date; 

    @Prop({ type: Date }) 
  checkOutTimestamp: Date;

  @Prop({ default: false })
  isLate?: boolean;

  @Prop({ default: false })
  isAbsent?: boolean;
 
  @Prop({ type: Object, default: null })
  geo?: { lat: number; lng: number };
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
