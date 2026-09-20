import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserSession } from '../../@types';
import { firstValueFrom } from 'rxjs';
import { serviceConfig } from '../../config/gateway-config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  validateJwtToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      throw new UnauthorizedException('Invalid Session token')
    }
  }

  async validateSessionToken(sessionToken): Promise<UserSession> {
    const { data } = await firstValueFrom(
      this.httpService.get<UserSession>(
        `${serviceConfig.users.url}/sessions/validate/${sessionToken}`,
        { timeout: serviceConfig.users.timeout },
      )
    )

    return data
  }

  async login (login: { email: string, password: string }) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${serviceConfig.users.url}/login`,
          login,
          { timeout: serviceConfig.users.timeout }
        )
      )

      return data
    } catch (error) {
      throw new UnauthorizedException('Invalid login credentials')
    }
  }

  async register(register: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${serviceConfig.users.url}/auth/register`,
          register,
          { timeout: serviceConfig.users.timeout }
        )
      )

      return data
    } catch (error) {
      throw new UnauthorizedException('Registration failed')
    }
  }
}
