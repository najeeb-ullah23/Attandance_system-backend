import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  BadRequestException, 
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';
import { CloudinaryStorageConfig } from '../config/cloudinary-config';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔐 Only HR and Owner can manually create new users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'hr')
  @Post('create-user')
  @UseInterceptors(FileInterceptor('profileImage', { storage: CloudinaryStorageConfig }))
  async createUser(@UploadedFile() file: Express.Multer.File, @Body()body: { 
    fullName: string; 
    email: string; 
    phoneNumber: string; 
    department: string; 
    address: string; 
    role: string; 
    password: string;
    profileImage: string;
  }) {
    const { fullName, email, phoneNumber, address, department, profileImage, role, password } = body;

    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email already exists');
    
     const imageUrl = file?.path || null;


    const hashed = await bcrypt.hash(password, 12);

    const user = await this.usersService.create({
      fullName,
      email,
      phoneNumber,
      department,
      address,
      role: 'employee',
      profileImage: imageUrl,
      password: hashed,
      confirmPassword: ''
    });

    
    return {
      message: 'User created successfully',
      createdBy: role,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        department: user.department,
        profileImage: user.profileImage,
        role: user.role,
      },
    };
  }
}
