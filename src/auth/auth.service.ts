import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  refreshToken(_refreshToken: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string, role: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // ✅ Store refresh token
    await this.usersService.update(user._id.toString(), { refreshToken });

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        department: user.department,
        profileImage: user.profileImage,
        address: user.address,
        email: user.email,
        role: user.role,
      },
    };
  }

    async logout(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    await this.usersService.update(userId, { refreshToken: null });
    return { message: 'Logout successful' };
  }
}
