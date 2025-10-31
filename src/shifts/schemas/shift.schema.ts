import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Shift extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  employeeId?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  start: string;

  @Prop({ required: true })
  end: string;

  @Prop({ default: '00:30' })
  break: string;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
