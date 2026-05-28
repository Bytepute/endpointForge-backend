import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // --- GLOBAL MIDDLEWARE ---
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  // --- DYNAMIC CORS SETUP ---

  const rawDomains =
    configService.get<string>('ALLOWED_DOMAINS') || 'localhost, lvh.me';
  const allowedBaseDomains = rawDomains.split(',').map((d) => d.trim());

  app.enableCors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      try {
        const originUrl = new URL(origin);

        const isAllowed = allowedBaseDomains.some(
          (domain) =>
            originUrl.hostname === domain ||
            originUrl.hostname.endsWith(`.${domain}`),
        );

        if (isAllowed) {
          return callback(null, true);
        }

        return callback(
          new Error(`CORS blocked: Origin ${origin} not allowed`),
        );
      } catch (error) {
        return callback(new Error(`CORS blocked: Invalid origin URL format`));
      }
    },
  });

  // --- SWAGGER SETUP ---
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Projects API')
    .setDescription('The projects API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // --- BOOTSTRAP ---
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger UI is available at: http://localhost:${port}/docs`);
  console.log(
    `🛡️  Allowed CORS Domains: ${allowedBaseDomains.join(', ')} (including subdomains)`,
  );
}
bootstrap();
