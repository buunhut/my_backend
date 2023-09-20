import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  AppService,
  AuthBasic,
  AuthGuard,
  NguoiDungService,
} from './app.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  AddPhieuMoiDto,
  ChiTietDto,
  DangNhapDto,
  DoiTacDto,
  NguoiDungDto,
  SanPhamDto,
  SavePhieuDto,
  SearchDto,
  UpdateDoiTacDto,
} from './app.dto';

@UseGuards(AuthBasic)
@ApiTags('nguoi-dung')
@Controller()
export class AppController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  @Post('dang-ky')
  @ApiProperty({ type: NguoiDungDto })
  dangKy(@Headers('token') token: string, @Body() nguoiDung: NguoiDungDto) {
    return this.nguoiDungService.create(nguoiDung);
  }

  @Post('dang-nhap')
  dangNhap(@Headers('token') token: string, @Body() dangNhap: DangNhapDto) {
    return this.nguoiDungService.dangNhap(dangNhap);
  }
}

@UseGuards(AuthGuard)
@ApiTags('san-pham')
@Controller()
export class SanPhamController {
  constructor(private readonly appService: AppService) {}

  @Post('add-sanpham')
  @ApiProperty({ type: SanPhamDto })
  postSanPham(@Headers('token') token: string, @Body() sanPham: SanPhamDto) {
    return this.appService.sanPham.create(sanPham);
  }

  @Get('danh-sach-sanpham/:ndId')
  getAllSanPham(@Headers('token') token: string, @Param('ndId') ndId: number) {
    return this.appService.sanPham.readAll(+ndId);
  }

  @Get('chi-tiet-sanpham/:spId')
  getOneSanPham(@Headers('token') token: string, @Param('spId') spId: number) {
    return this.appService.sanPham.readOne(+spId);
  }

  @Put('edit-sanpham/:spId')
  @ApiProperty({ type: SanPhamDto })
  putSanPham(
    @Headers('token') token: string,
    @Param('spId') spId: number,
    @Body() sanPham: SanPhamDto,
  ) {
    return this.appService.sanPham.update(+spId, sanPham);
  }

  @Delete('del-sanpham/:spId')
  delSanPham(@Headers('token') token: string, @Param('spId') spId: number) {
    return this.appService.sanPham.delete(+spId);
  }

  @Post('search-sanpham')
  @ApiProperty({ type: SearchDto })
  searchSanPham(@Headers('token') token: string, @Body() search: SearchDto) {
    return this.appService.sanPham.search(search);
  }
}

@UseGuards(AuthGuard)
@ApiTags('doi-tac')
@Controller()
export class DoiTacController {
  constructor(private readonly appService: AppService) {}

  @Post('add-doitac')
  @ApiProperty({ type: DoiTacDto })
  postDoiTac(@Headers('token') token: string, @Body() doiTac: DoiTacDto) {
    return this.appService.doiTac.create(doiTac);
  }

  @Get('danh-sach-npp/:ndId')
  getAllNpp(@Headers('token') token: string, @Param('ndId') ndId: number) {
    return this.appService.doiTac.readAllNpp(+ndId);
  }

  @Get('chi-tiet-npp/:dtId')
  getOneNpp(@Headers('token') token: string, @Param('dtId') dtId: number) {
    return this.appService.doiTac.readOneNpp(+dtId);
  }

  @Get('danh-sach-khachhang/:ndId')
  getAllKh(@Headers('token') token: string, @Param('ndId') ndId: number) {
    return this.appService.doiTac.readAllKh(+ndId);
  }

  @Get('chi-tiet-khachhang/:dtId')
  getOneKh(@Headers('token') token: string, @Param('dtId') dtId: number) {
    return this.appService.doiTac.readOneKh(+dtId);
  }

  @Put('edit-doitac/:dtId')
  @ApiProperty({ type: UpdateDoiTacDto })
  putSanPham(
    @Headers('token') token: string,
    @Param('dtId') dtId: number,
    @Body() doiTac: UpdateDoiTacDto,
  ) {
    return this.appService.doiTac.update(+dtId, doiTac);
  }

  @Delete('del-doitac/:dtId')
  delSanPham(@Headers('token') token: string, @Param('dtId') dtId: number) {
    return this.appService.doiTac.delete(+dtId);
  }

  @Post('search-npp')
  @ApiProperty({ type: SearchDto })
  searchNpp(@Headers('token') token: string, @Body() search: SearchDto) {
    return this.appService.doiTac.searchNpp(search);
  }
  @Post('search-kh')
  @ApiProperty({ type: SearchDto })
  searchKh(@Headers('token') token: string, @Body() search: SearchDto) {
    return this.appService.doiTac.searchKh(search);
  }
}

@UseGuards(AuthGuard)
@ApiTags('theo-doi-phieu')
@Controller()
export class PhieuController {
  constructor(private readonly appService: AppService) {}

  @Get('phieunhap-moi/:ndId')
  getPhieuNhap(@Headers('token') token: string, @Param('ndId') ndId: number){
    return this.appService.phieu.getPhieuNhap(+ndId)
  }

  @Get('phieuxuat-moi/:ndId')
  getPhieuXuat(@Headers('token') token: string, @Param('ndId') ndId: number){
    return this.appService.phieu.getPhieuXuat(+ndId)
  }

  @Post('add-phieu-moi')
  @ApiProperty({ type: AddPhieuMoiDto })
  addPhieu(@Headers('token') token: string, @Body() phieuMoi: AddPhieuMoiDto) {
    return this.appService.phieu.addPhieu(phieuMoi);
  }
  @Post('save-phieu-moi')
  @ApiProperty({ type: SavePhieuDto })
  savePhieu(@Headers('token') token: string, @Body() savePhieu: SavePhieuDto) {
    return this.appService.phieu.savePhieu(savePhieu)
  }

  @Delete('del-phieu/:pId')
  delPhieu(@Headers('token') token: string, @Param('pId') pId: number) {
    return this.appService.phieu.delPhieu(+pId)
  }
}

@UseGuards(AuthGuard)
@ApiTags('theo-doi-chi-tiet')
@Controller()
export class ChiTietController {
  constructor(private readonly appService: AppService) {}

  @Post('add-chitiet')
  @ApiProperty({ type: ChiTietDto })
  addChiTiet(@Headers('token') token: string, @Body() chiTiet: ChiTietDto) {
    return this.appService.chiTiet.addChiTiet(chiTiet);
  }

  @Get('chitietnhap/:ndId')
  getChiTietNhap(@Headers('token') token: string, @Param('ndId') ndId: number) {
    return this.appService.chiTiet.readChiTietNhap(+ndId);
  }

  @Get('chitietxuat/:ndId')
  getChiTietXuat(@Headers('token') token: string, @Param('ndId') ndId: number) {
    return this.appService.chiTiet.readChiTietXuat(ndId);
  }

  @Put('edit-chitiet/:ctId')
    editChiTiet(@Headers('token') token: string, @Param('ctId') ctId: number){
      return this.appService.chiTiet.editChitiet(ctId);
    }

  @Delete('del-chitiet/:ctId')
  delChiTiet(@Headers('token') token: string, @Param('ctId') ctId: number) {
    return this.appService.chiTiet.delChiTiet(+ctId);
  }
}
