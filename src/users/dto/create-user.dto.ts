import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
    @IsOptional()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string; 
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  department?: string;

   @IsOptional()
  @IsString()
  address?: string;

    @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsEnum(['owner', 'hr', 'admin', 'employee'])
  role?: string;
}