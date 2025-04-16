import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('JWT Auth Guard - Request Method:', request.method);
    console.log('JWT Auth Guard - Request URL:', request.url);
    console.log('JWT Auth Guard - Request Headers:', request.headers);

    return super.canActivate(context);
  }

  // Passport's AuthGuard uses any types in handleRequest method
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest(err: any, user: any, info: any) {
    console.log('JWT Auth Guard - Error:', err);
    console.log('JWT Auth Guard - User:', user);
    console.log('JWT Auth Guard - Info:', info);

    if (err || !user) {
      if (info && info.message === 'No auth token') {
        throw new UnauthorizedException(
          'Authentication required. Please provide a valid JWT token.',
        );
      }

      if (info && info.message) {
        throw new UnauthorizedException(
          `Authentication failed: ${info.message}`,
        );
      }

      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }
    return user;
  }
}
