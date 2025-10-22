import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 26431;
    app.enableCors();
    await app.listen(port);
    console.log(`Server listening on http://localhost:${port}`);
}

bootstrap();