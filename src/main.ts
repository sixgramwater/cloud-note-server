import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 过滤传过来的不属于DTO的属性
    forbidNonWhitelisted: true, // 当发现不属于DTO的属性时，直接报错
    transform: true, // false时，DTO只是拥有DTO类的形状，而不是真正的DTO类的实例；同时，能够将controller的路由参数由默认的string，进行转化
  }));
  await app.listen(3000);
}
bootstrap();
