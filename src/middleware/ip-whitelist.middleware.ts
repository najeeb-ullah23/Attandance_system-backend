// src/middleware/ip-whitelist.middleware.ts
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { allowedIps } from '../config/ip-whitelist.config';

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket.remoteAddress;

    // ✅ Allow localhost & common internal addresses
    if (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip?.startsWith('192.168.') || // local network
      ip?.startsWith('::ffff:192.168.') // IPv6 local
    ) {
      return next();
    }

    // ✅ Allow frontend hosted on Vercel (domain check)
    const origin = req.headers.origin;
    if (
      origin?.includes('attendance-frontend-bsolutions.vercel.app') ||
      origin?.includes('localhost:3000')
    ) {
      return next();
    }

    // ✅ Fallback: match config IPs
    if (allowedIps.includes(ip)) {
      return next();
    }

    throw new ForbiddenException(
      `Access denied for IP: ${ip || 'unknown'}`,
    );
  }
}
