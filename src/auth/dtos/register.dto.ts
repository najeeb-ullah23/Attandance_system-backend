import { IsEmail, IsString, MinLength, IsOptional } from "class-validator"

export class RegisterDto {
  @IsString()
  fullName: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  password: string

  @IsString()
  confirmPassword: string

  @IsString()
  @IsOptional()
  phoneNumber?: string

  @IsString()
  @IsOptional()
  department?: string

  @IsString()
  @IsOptional()
  address?: string

    @IsString()
  @IsOptional()
  profileImage?: string

  @IsString()
  @IsOptional()
  role?: string
}
