import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Module({
  imports: [],
  providers: [ProxyService],
  exports: [],
})
export class ProxyModule {}
