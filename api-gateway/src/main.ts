import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
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

  const port = process.env.PORT || 3005

  await app.listen(port);

  console.log('ta rodando')
}
bootstrap();
