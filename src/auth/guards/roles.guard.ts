import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!requiredRoles) {
      return true; // Allow access if no roles are required
    }

    if (!user || !requiredRoles.includes(user.role_id)) {
      throw new ForbiddenException(
        "You don't have permission to access this resource.",
      );
    }
    return true;
  }
}
