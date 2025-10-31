import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Audit extends Document {
  @Prop()
  userId: string;

  @Prop()
  action: string;

  @Prop({ type: Object })
  meta: any;
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
