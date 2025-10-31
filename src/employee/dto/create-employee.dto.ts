import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  readonly fullName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly position?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

    @IsString()
  @IsOptional()
  readonly profileImage?: string;

  @IsString()
  @IsOptional()
  readonly department?: string;
}
