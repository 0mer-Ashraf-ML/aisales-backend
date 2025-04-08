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
    const authHeader = request.headers.authorization;

    // Check if Authorization header exists and is properly formatted
    if (!authHeader) {
      this.logger.warn('Missing authorization header in request');
      throw new UnauthorizedException('Authorization header is missing');
    }

    // If header doesn't start with Bearer, extract and format it correctly
    if (!authHeader.startsWith('Bearer ')) {
      const token = this.extractToken(request);
      if (!token) {
        this.logger.warn('Invalid authorization format');
        throw new UnauthorizedException('Invalid authorization format');
      }
      // Patch Authorization header for Passport to pick up
      request.headers.authorization = `Bearer ${token}`;
    }

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

    if (!authHeader) return null;

    // If it already has Bearer prefix, extract the token part
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    // If it's just the token without Bearer prefix
    return authHeader;
  }
}
