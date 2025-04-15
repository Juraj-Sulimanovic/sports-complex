import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    console.log('Admin Guard - User:', user);

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    if (user.role !== UserRole.ADMIN) {
      console.error('Admin Guard - User role:', user.role);
      throw new ForbiddenException('Only admin users can access this endpoint');
    }

    return true;
  }
} 