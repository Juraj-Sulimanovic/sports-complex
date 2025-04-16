import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Strategy - Validating payload:', payload);

    if (!payload || !payload.sub || !payload.email) {
      console.error('JWT Strategy - Invalid payload:', payload);
      throw new UnauthorizedException('Invalid token payload');
    }

    if (!payload.role) {
      console.error('JWT Strategy - Missing role in payload:', payload);
      throw new UnauthorizedException('Missing role in token');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
