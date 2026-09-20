import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from "../auth/service/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    })
  }

  async validate(payload: any) {
    if (!payload) throw new UnauthorizedException('Invalid token payload')

    const user = await this.authService.validateJwtToken(payload.token)
    if (!user) throw new UnauthorizedException()

    return { userId: payload.sub, email: payload.email, role: payload.role }
  }
}