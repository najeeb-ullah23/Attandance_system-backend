import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmployeeService } from '../employee/employee.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CloudinaryStorageConfig } from '../config/cloudinary-config';
import { CompanyService } from '../company/company.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,

  ) {}

@Post('register-owner')
  @UseInterceptors(FileInterceptor('profileImage', { storage: CloudinaryStorageConfig }))
async registerOwner( @UploadedFile() file: Express.Multer.File,
  @Body() body: any) {
  const { fullName, email, phoneNumber, address, password, confirmPassword, companyName } = body;

  if (password !== confirmPassword) throw new BadRequestException('Passwords do not match');

  const existing = await this.usersService.findByEmail(email);
  if (existing) throw new BadRequestException('Email already exists');

  const hashed = await bcrypt.hash(password, 12);

  const imageUrl = file?.path || null;


  // 1️⃣ Create owner 
  const user = await this.usersService.create({
    fullName,
    email,
    phoneNumber,
    address,
    password: hashed,
    role: 'owner',
    department: '',
    profileImage: imageUrl,
    confirmPassword: ''
  });

  // 2️⃣ Create the company linked to this owner
  const company = await this.companyService.create({
    fullName: companyName,
    address,
    owner: user._id.toString(),
  });

  // 3️⃣ Update owner with companyId
  user.companyId = company._id.toString();
  await user.save();

  return {
    message: 'Owner and company registered successfully',
    user,
    company,
  };
}




  // ✅ Register 
  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage', { storage: CloudinaryStorageConfig }))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const { fullName, email, phoneNumber, department, address, role = 'employee', password, confirmPassword } = body;

    if (password !== confirmPassword)
      throw new BadRequestException('Passwords do not match');

    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(password, 12);

    // ✅ Cloudinary image URL
    const imageUrl = file?.path || null;

    const user = await this.usersService.create({
      fullName,
      email,
      phoneNumber,
      department,
      address,
      role,
      password: hashed,
      confirmPassword,
      profileImage: imageUrl,
    });

    if (role === 'employee') {
      await this.employeeService.create({
        userId: user._id,
        fullName,
        email,
        phoneNumber,
        address,
        department,
        profileImage: imageUrl,
        position: 'Employee',
        status: 'Active',
      });
    }

    return { message: 'Registered successfully', user };
  }


  // ✅ Login
  @Post('login')
  async login(@Body() dto: { email: string; password: string; role: string }) {
    return this.authService.login(dto.email, dto.password, dto.role);
  }

  // ✅ Refresh token
  @Post('refresh-token')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  // ✅ Logout (protected)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const userId = req.user.userId;
    return this.authService.logout(userId);
  }

  // ✅ Get current user
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async my(@Req() req) {
    return this.usersService.getMyProfile(req.user.userId);
  }
}
