import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ default: 'active' })
  status: string;

    @Prop({ default: 'active' })
    contactEmail: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
