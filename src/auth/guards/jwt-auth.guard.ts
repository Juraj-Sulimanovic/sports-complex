import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    console.log('JWT Auth Guard - Error:', err);
    console.log('JWT Auth Guard - User:', user);
    console.log('JWT Auth Guard - Info:', info);

    if (err || !user) {
      if (info && info.message) {
        throw new UnauthorizedException(`Authentication failed: ${info.message}`);
      }
      throw new UnauthorizedException('Invalid or missing authentication token');
    }
    return user;
  }
} 