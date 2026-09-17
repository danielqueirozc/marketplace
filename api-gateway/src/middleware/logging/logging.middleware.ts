import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('http')

  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, ip } = req
    const userAgent = req.get('User-Agent')
    const startTime = Date.now()

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`
    )

    res.on('finish', () => {
      const { statusCode } = res
      const contentLength = res.get('Content-Length')
      const duration = Date.now() - startTime

      this.logger.log(
        `Outgoing Response: ${method} ${originalUrl} - ${statusCode} - ${contentLength || 0} - ${duration}ms`
      )
      if (statusCode >= 400) {
        this.logger.error(
        `Error Response: ${method} ${originalUrl} - ${statusCode} ${duration}ms`
        )
      }
    })

    // error logs
    res.on('error', (error) => {
      this.logger.error(
        `Response Error: ${method} ${originalUrl} - ${error.message}`
      )
    })
    
    // timeout log
    req.on('timeout', () => {
      this.logger.warn(
        `Request Timeout ${method} ${originalUrl} - ${Date.now()}`
      )
    })
    
    next();
  }
}
