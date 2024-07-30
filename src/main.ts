import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as express from 'express';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    }),
  );
  // redirect https
  const httpApp = express();
  httpApp.get('*', (req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
  });
  httpApp.listen(80);

  await app.listen(443, '0.0.0.0');
}
bootstrap();
