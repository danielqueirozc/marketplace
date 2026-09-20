import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const sessionToken = request.headers['X-session-token']

    if (!sessionToken) throw new UnauthorizedException('Session token required')

    try {
      const session = await this.authService.validateSessionToken(sessionToken)

      if (!session.valid || !session.user) throw new UnauthorizedException('Session token required')
      
      request.user = session.user
      return true

    } catch (error) {
      throw new UnauthorizedException('Session token required')
    }
  }
}
