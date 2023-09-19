import { Module } from '@nestjs/common';
import { AppController, ChiTietController, DoiTacController, PhieuController, SanPhamController } from './app.controller';
import { AppService, AuthBasic, AuthGuard, NguoiDungService } from './app.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'TIGER', // Thay thế bằng secret key thực tế của bạn
      signOptions: { expiresIn: '1d' }, // Thời hạn của token
    }),
  ],
  controllers: [AppController, SanPhamController, DoiTacController, PhieuController, ChiTietController],
  providers: [AppService, NguoiDungService, AuthGuard, AuthBasic],
})
export class AppModule {}