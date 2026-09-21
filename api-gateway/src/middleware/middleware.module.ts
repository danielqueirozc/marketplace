import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  providers: [LoggingMiddleware],
})

export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
