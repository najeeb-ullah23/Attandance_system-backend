import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Leave extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  employeeId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  reason: string;

    @Prop()
  optionalnumber: number;

    @Prop()
  emergencynumber: number;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
