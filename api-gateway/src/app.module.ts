import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { MiddlewareModule } from './middleware/middleware.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
       {
        name: 'medium',
        ttl: 60000, // 1 mintes
        limit: 100, // 100 requests per minute
      },
       {
        name: 'long',
        ttl: 90000, // 1 second
        limit: 1000, // 1000 requests per 15 minutes
      },
    ]),
    ProxyModule,
    MiddlewareModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
