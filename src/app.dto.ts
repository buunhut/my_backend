import { ApiProperty } from "@nestjs/swagger";
//dto người dùng
export class NguoiDungDto {
    @ApiProperty({type: 'string'})
    taiKhoan: string
    @ApiProperty({type: 'string'})
    matKhau: string
    @ApiProperty({type: 'string'})
    fullName: string
    @ApiProperty({type: 'string'})
    email: string
    @ApiProperty({type: 'string'})
    phone: string
    @ApiProperty({type: 'string'})
    address: string
    @ApiProperty({type: 'string'})
    company: string
    @ApiProperty({type: 'string'})
    mst: string
}
//dto đăng nhập
export class DangNhapDto {
    @ApiProperty({type: 'string'})
    taiKhoan: string
    @ApiProperty({type: 'string'})
    matKhau: string

}

//dto đối tác
export class DoiTacDto {
    @ApiProperty({type: 'string'})
    maDt: string
    @ApiProperty({type: 'string'})
    tenDt: string
    @ApiProperty({type: 'string'})
    lienHe: string
    @ApiProperty({type: 'string'})
    email: string
    @ApiProperty({type: 'string'})
    phone: string
    @ApiProperty({type: 'string'})
    address: string
    @ApiProperty({type: 'string'})
    mst: string
    @ApiProperty({type: 'string'})
    loaiDt: string
    @ApiProperty({type: 'number'})
    ndId: number
}
export class UpdateDoiTacDto {
    @ApiProperty({type: 'string'})
    maDt: string
    @ApiProperty({type: 'string'})
    tenDt: string
    @ApiProperty({type: 'string'})
    lienHe: string
    @ApiProperty({type: 'string'})
    email: string
    @ApiProperty({type: 'string'})
    phone: string
    @ApiProperty({type: 'string'})
    address: string
    @ApiProperty({type: 'string'})
    mst: string
    @ApiProperty({type: 'number'})
    ndId: number
}

//dto sản phẩm
export class SanPhamDto {
    @ApiProperty({type: 'string'})
    danhMuc: string
    @ApiProperty({type: 'string'})
    maSp: string
    @ApiProperty({type: 'string'})
    tenSp: string
    @ApiProperty({type: 'string'})
    dvt: string
    @ApiProperty({type: 'string'})
    chiTiet: string
    @ApiProperty({type: 'number'})
    baoHanh: number
    @ApiProperty({type: 'number'})
    giaNhap: number
    @ApiProperty({type: 'number'})
    giaBan: number
    @ApiProperty({type: 'number'})
    ndId: number
}

//dto search
export class SearchDto {
    @ApiProperty({type: 'string'})
    keyword: string
    @ApiProperty({type: 'number'})
    ndId: number
}

//dto phiếu
export class AddPhieuMoiDto {
    @ApiProperty({type: 'string'})
    loaiPhieu: string
    @ApiProperty({type: 'string', format: 'date-time'})
    ngay: Date
    @ApiProperty({type: 'number'})
    dtId: number
    @ApiProperty({type: 'string'})
    ghiChu: string
    @ApiProperty({type: 'number'})
    ndId: number
}

export class SavePhieuDto {
    @ApiProperty({type: 'string'})
    loaiPhieu: string
    @ApiProperty({type: 'number'})
    soPhieu: number
    @ApiProperty({type: 'number'})
    thanhToan: number
    @ApiProperty({type: 'number'})
    ndId: number
}

//dto chi tiết phiếu
export class ChiTietDto {
    @ApiProperty({type: 'string'})
    loaiPhieu: string
    @ApiProperty({type: 'number'})
    soPhieu: number
    @ApiProperty({type: 'number'})
    spId: number
    @ApiProperty({type: 'number'})
    soLuong: number
    @ApiProperty({type: 'number'})
    donGia: number
    @ApiProperty({type: 'number'})
    ndId: number
}
