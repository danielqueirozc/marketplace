import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { MiddlewareModule } from './middleware/middleware.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // minute
        limit: 100, // 100 requests for minute
      }
    ]),
    ProxyModule,
    MiddlewareModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
