import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'
import { JwtModule }from '@nestjs/jwt' 
import { ConfigService } from '@nestjs/config';
import { AuthService } from './service/auth.service';
import type { Env } from '../env';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService<Env, true>) => ({
        secret: config.get('JWT_SECRET', { infer: true }),
        signOptions: { expiresIn: '24h' }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
