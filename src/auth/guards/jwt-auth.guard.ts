import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      this.logger.warn('Missing token in request');
      throw new UnauthorizedException('Authorization token is missing');
    }

    // Patch Authorization header for Passport to pick up
    request.headers.authorization = `Bearer ${token}`;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      const message =
        info?.message || err?.message || 'Unauthorized access attempt';
      this.logger.warn(`Authentication failed: ${message}`);
      throw new UnauthorizedException(message);
    }

    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('JWT token has expired');
    } else if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('JWT token is malformed');
    } else if (info?.name === 'NotBeforeError') {
      throw new UnauthorizedException('JWT token not active yet');
    }

    return user;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  }
}
