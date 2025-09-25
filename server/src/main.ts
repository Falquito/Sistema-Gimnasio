import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  app.enableCors();
=======

  // habilitamos CORS
  app.enableCors({
    origin: "http://localhost:5173"
  });

>>>>>>> 4476f43cac5131d7f9601eb86c55c06caa1c8982
  app.useGlobalPipes(
  new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  })
  );
  const config = new DocumentBuilder()
    .setTitle('API Shark Fit')
    .setDescription('Documentacion')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
