import type { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { serviceConfig } from '../config/gateway-config';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name)

  constructor(private readonly httpService: HttpService) {}

  async proxyRequest(
    serviceName: keyof typeof serviceConfig,
    method: string,
    path: string,
    body?: any,
    headers?: any,
    userInfo?: any
  ) {
    const service = serviceConfig[serviceName]
    const url = `${service.url}${path}`

    this.logger.log(`Proxing ${method} request to ${serviceName}: ${url}`)

    try {
      const enhancedHeader = {
        ...headers,
        'x-user-id': userInfo?.id,
        'x-user-name': userInfo?.name,
        'x-user-role': userInfo?.role,
      }
    } catch (error) {
      this.logger.log(`Error proxing ${method} request to ${serviceName}: ${url}`)
      throw error
    }
  }
}
