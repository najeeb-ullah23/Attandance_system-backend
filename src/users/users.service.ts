import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User, UserDocument } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { AttendanceService } from '../attendance/attendance.service'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private readonly attendanceService : AttendanceService)
  {}

async create(data: { fullName: string; email: string; phoneNumber: string; department: string; address: string; role?: string; profileImage: string; password: string; confirmPassword: string }) {
  const newUser = new this.userModel(data);
  return newUser.save();
  
}
async update(id: string, updateData: any) {
  if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  
}

  async findAll() {
    return this.userModel.find()
  }

  async findById(id: string) {
  return this.userModel.findById(id);
}


  async findByEmail(email: string) {
  return this.userModel.findOne({ email });
}

async getMyProfile(employeeId: string) {
  const user = await this.userModel
    .findById(employeeId)
    .select('fullName email role phoneNumber department profileImage');

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const todayAttendance = await this.attendanceService.getTodayAttendance(employeeId);
  const attendanceHistory = await this.attendanceService.getAttendanceHistory(employeeId);
  const leaveBalance = [];
  const recentLeaves = [];

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    phoneNumber: user.phoneNumber,
    department: user.department,
    todayAttendance,
    attendanceHistory,
    leaveBalance,
    recentLeaves,
  };
}



 async registerUser(dto: CreateUserDto) {
  if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  const existing = await this.userModel.findOne({ email: dto.email });
  if (existing) throw new BadRequestException('Email already exists');

  const hashed = await bcrypt.hash(dto.password, 10);
  const newUser = new this.userModel({
    fullName: dto.fullName,
    email: dto.email,
    password: hashed,
    role: dto.role || 'employee',
    address: dto.address,
    phoneNumber: dto.phoneNumber, 
    department: dto.department,
    profileImage: dto.profileImage
  });
  return await newUser.save();
}

async createByOwnerOrHR(dto: CreateUserDto, creator) {
  if (!['owner', 'hr'].includes(creator.role)) {
    throw new ForbiddenException('Only Owner or HR can create employees.');
  }
if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }
  const hashed = await bcrypt.hash(dto.password, 10);
  const newUser = new this.userModel({
    fullName: dto.fullName,
    email: dto.email,
    password: hashed,
    role: dto.role || 'employee',
    createdBy: creator._id,
  });
  return await newUser.save();
}
}
