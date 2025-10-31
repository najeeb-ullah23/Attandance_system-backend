import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  
  @Prop({ required: true, unique: true })
  phoneNumber: string;
 
   @Prop({ required: true })
   address: string;

     @Prop({ default: null })
  profileImage?: string; 


  @Prop({ required: true })
  password: string;

    @Prop({ required: true })
  department: string;

    @Prop({ required: true })
  role?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
