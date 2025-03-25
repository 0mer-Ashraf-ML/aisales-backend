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

    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (!user || err) {
      this.logger.warn('Authentication failed', err?.message || info?.message);
      throw err || new UnauthorizedException('Authentication failed');
    }

    if (info) {
      switch (info.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('Token has expired');
        case 'JsonWebTokenError':
          throw new UnauthorizedException('Invalid token format');
        case 'NotBeforeError':
          throw new UnauthorizedException('Token not yet valid');
      }
    }

    return user;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  }
}
