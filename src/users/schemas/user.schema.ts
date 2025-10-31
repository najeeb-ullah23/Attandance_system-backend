import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true, unique: true })
  phoneNumber: string

  @Prop({ required: true, })
  department: string

  
  @Prop({ required: true, })
  address: string
  
  @Prop({ required: true })
  password: string

   @Prop({ required: true })
  confirmPassword: string


   @Prop({ default: null })
  profileImage?: string; 


  @Prop({
    type: String,
    enum: [ 'owner', 'admin', 'hr', 'employee'],
    default: 'employee',
  })
  role: string

    @Prop({ type: Types.ObjectId, ref: 'Company', default: null })
  companyId?: string;

  @Prop({ default: null })
  refreshToken?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User)
