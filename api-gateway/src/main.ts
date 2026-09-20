import { readFileSync } from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import getSwaggerUiAbsoluteFSPath from 'swagger-ui-dist/absolute-path.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // permite apenas recursos da mesma origib
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // fonte de estilo css
        imgSrc: ["'self'", 'data:', 'https:']
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: { // forçar navegadores a usar https sempre que se conectarem com a gente
      maxAge: 31536000, // segundos
      includeSubDomains: true, // ex: localhost:3000/algumacoisa
      preload: true // pre carregamento
    }
  }))
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      const allowedOrigins= process.env.CORS_ORIGIN?.split(',') || ['*']

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Bot allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-with',
      'Accept',
      'Origin',
      'Access-Control-Rquest-Method',
      'Access-Control-Rquest-Headers'
    ],
    credentials: true,
    maxAge: 86400 // 24 hours
  }),
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  const config = new DocumentBuilder()
    .setTitle('Marketplace API Gateway')
    .setDescription('API Gateway for Marketplace Microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  
  const httpAdapter = app.getHttpAdapter()
  const swaggerAssetsPath = getSwaggerUiAbsoluteFSPath()
  const swaggerAssets: Record<string, string> = {
    'swagger-ui.css': 'text/css',
    'swagger-ui-bundle.js': 'application/javascript',
    'swagger-ui-standalone-preset.js': 'application/javascript',
  }
  for (const [filename, contentType] of Object.entries(swaggerAssets)) {
    const content = readFileSync(join(swaggerAssetsPath, filename))
    httpAdapter.get(`/api/${filename}`, (req: unknown, res: { type: (t: string) => void, send: (b: Buffer) => void }) => {
      res.type(contentType)
      res.send(content)
    })
  }

  const port = process.env.PORT || 3005

  await app.listen(port)

  console.log('ta rodando')
}
bootstrap()
