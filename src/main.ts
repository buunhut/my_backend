import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({ origin: "*" });


  //cấu hình swagger API
  const config = new DocumentBuilder()
    .setTitle('CYBERSOFT - NODEJS KHOÁ 33')
    .setDescription('API nguoi-dung truyền vào headers token="HELLO"')
    .setVersion('v1.0')
    // .addTag('your-tag') // Thêm các tag mô tả API của bạn
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8080);
}
bootstrap();


//khởi tạo dự án nestjs bằng lệnh nest new tên dự án
//test khởi chạy bằng yarn start:dev

//cài prisma
//yarn add prisma @prisma/client
//yarn prisma init, chạy xong vào .env sửa thông tin chuỗi kết nối, vào schema.prisma sửa provider = "mysql"

//yarm prisma db pull
//yarn prisma generate