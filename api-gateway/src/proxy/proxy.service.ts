import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { serviceConfig } from '../config/gateway-config';
import { firstValueFrom } from 'rxjs';

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

      const response = await firstValueFrom(
        this.httpService.request({
          method: method.toLowerCase(),
          url,
          headers: enhancedHeader,
          timeout: service.timeout,
        })
      )

      return response
    } catch (error) {
      this.logger.log(`Error proxing ${method} request to ${serviceName}: ${url}`)
      throw error
    }
  }

  async getServiceHealth(serviceName: keyof typeof serviceConfig) {
    try {
      const service = serviceConfig[serviceName]
      const response = await firstValueFrom(
        this.httpService.get(`${service.url}/health`, { timeout: 3000 })
      )

      return { status: 'healthy', data: response.data }
    } catch (error: any) {
      return { status: 'unhealthy', error: error.message }
    }
  }
}
