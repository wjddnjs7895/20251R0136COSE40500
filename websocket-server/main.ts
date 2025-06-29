import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomExceptionFilter } from './common/exception/custom.exception.filter';
import { CustomLogger } from './common/logger/custom.logger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';

process.env.TZ = 'UTC';

async function bootstrap() {
  const logger = new CustomLogger();

  const app = await NestFactory.create(AppModule, {
    logger,
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useWebSocketAdapter(new IoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('API List')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  await app.listen(8080);
}
bootstrap();
