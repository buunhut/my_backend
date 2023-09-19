import {
  SanPhamDto,
  NguoiDungDto,
  DangNhapDto,
  SearchDto,
  DoiTacDto,
  AddPhieuMoiDto,
  ChiTietDto,
  SavePhieuDto,
  UpdateDoiTacDto,
} from './app.dto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const trangThai = 'hoạt động';
const myResponse = (statusCode: number, message: string, content: any) => {
  return {
    statusCode,
    message,
    content,
  };
};

@Injectable()
export class AppService {
  //sản phẩm
  sanPham = {
    //tạo sản phẩm
    async create(sanPham: SanPhamDto) {
      try {
        const { maSp, tenSp, ndId } = sanPham;
        //check xem maSp và tenSp đã có chưa
        const checkMa = await prisma.sanPham.findFirst({
          where: {
            maSp,
            ndId,
            trangThai,
          },
        });
        if (checkMa) {
          return myResponse(409, 'mã sản phẩm đã tồn tại', maSp);
        } else {
          const checkTen = await prisma.sanPham.findFirst({
            where: {
              tenSp,
              ndId,
              trangThai,
            },
          });
          if (checkTen) {
            return myResponse(409, 'tên sản phẩm đã tồn tại', tenSp);
          } else {
            const data = {
              ...sanPham,
              tonKho: 0,
              trangThai,
            };
            const taoSanPham = await prisma.sanPham.create({
              data,
            });
            return myResponse(200, 'sản phẩm đã được tạo', taoSanPham);
          }
        }
      } catch (error) {
        throw error;
      }
    },

    //get tất cả sản phẩm
    async readAll(ndId: number) {
      try {
        const danhSachSanPham = await prisma.sanPham.findMany({
          where: {
            ndId,
            trangThai,
          },
        });
        if (danhSachSanPham.length > 0) {
          return myResponse(200, 'danh sách sản phẩm', danhSachSanPham);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    //get 1 sản phẩm
    async readOne(spId: number) {
      try {
        const sanPham = await prisma.sanPham.findFirst({
          where: {
            spId,
            trangThai,
          },
        });
        if (sanPham) {
          return myResponse(200, 'chi tiết sản phẩm', sanPham);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    //cập nhật sản phẩm
    async update(spId: number, sanPham: SanPhamDto) {
      try {
        const { maSp, tenSp, ndId } = sanPham;
        //check maSp và tenSp không được trùng, trừ spId hiện tại
        const checkMa = await prisma.sanPham.findFirst({
          where: {
            maSp,
            ndId,
            trangThai,
            NOT: {
              spId,
            },
          },
        });
        if (checkMa) {
          return myResponse(409, 'mã sản phẩm đã tồn tại', maSp);
        } else {
          const checkTen = await prisma.sanPham.findFirst({
            where: {
              tenSp,
              ndId,
              trangThai,
              NOT: {
                spId,
              },
            },
          });
          if (checkTen) {
            return myResponse(409, 'tên sản phẩm đã tồn tại', tenSp);
          } else {
            const result = await prisma.sanPham.updateMany({
              data: sanPham,
              where: {
                spId,
              },
            });
            return myResponse(200, 'đã cập nhật', sanPham);
          }
        }
      } catch (error) {
        throw error;
      }
    },

    //xoá sản phẩm
    async delete(spId: number) {
      try {
        const checkId = await prisma.sanPham.findFirst({
          where: {
            spId,
            trangThai,
          },
        });
        if (checkId) {
          const result = await prisma.sanPham.updateMany({
            data: {
              trangThai: 'xoá',
            },
            where: {
              spId,
              trangThai,
            },
          });
          if (result) {
            return myResponse(200, 'đã xoá sản phẩm', checkId);
          }
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    //tìm kiếm sản phẩm
    async search(search: SearchDto) {
      try {
        const { keyword, ndId } = search;
        const result = await prisma.sanPham.findMany({
          where: {
            OR: [
              {
                danhMuc: {
                  contains: keyword,
                },
              },
              {
                maSp: {
                  contains: keyword,
                },
              },
              {
                tenSp: {
                  contains: keyword,
                },
              },
            ],
            ndId,
            trangThai,
          },
        });
        if (result.length > 0) {
          return myResponse(200, 'kết quả tìm kiếm', result);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },
  };
  //đói tác
  doiTac = {
    async create(doiTac: DoiTacDto) {
      try {
        const { maDt, tenDt, loaiDt, ndId } = doiTac;
        const checkMa = await prisma.doiTac.findFirst({
          where: {
            maDt,
            ndId,
            loaiDt,
            trangThai,
          },
        });
        if (checkMa) {
          return myResponse(409, 'mã đối tác đã tồn tại', null);
        } else {
          const checkTen = await prisma.doiTac.findFirst({
            where: {
              tenDt,
              ndId,
              loaiDt,
              trangThai,
            },
          });
          if (checkTen) {
            return myResponse(409, 'tên đối tác đã tồn tại', null);
          } else {
            //tạo đối tác
            const data = {
              ...doiTac,
              trangThai,
            };
            const taoDoiTac = await prisma.doiTac.create({
              data,
            });
            return myResponse(200, 'đã tạo đối tác', taoDoiTac);
          }
        }
      } catch (error) {
        throw error;
      }
    },

    async readAllNpp(ndId: number) {
      try {
        const danhSachNpp = await prisma.doiTac.findMany({
          where: {
            loaiDt: 'npp',
            ndId,
            trangThai,
          },
        });
        if (danhSachNpp.length > 0) {
          return myResponse(200, 'danh sách npp', danhSachNpp);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async readOneNpp(dtId: number) {
      try {
        const npp = await prisma.doiTac.findFirst({
          where: {
            loaiDt: 'npp',
            dtId,
          },
        });
        if (npp) {
          return myResponse(200, 'chi tiết npp', npp);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async readAllKh(ndId: number) {
      try {
        const danhSachKhachHang = await prisma.doiTac.findMany({
          where: {
            loaiDt: 'kh',
            ndId,
            trangThai,
          },
        });
        if (danhSachKhachHang.length > 0) {
          return myResponse(200, 'danh sách khách hàng', danhSachKhachHang);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async readOneKh(dtId: number) {
      try {
        const khachHang = await prisma.doiTac.findFirst({
          where: {
            loaiDt: 'kh',
            dtId,
          },
        });
        if (khachHang) {
          return myResponse(200, 'chi tiết khách hàng', khachHang);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async update(dtId: number, doiTac: UpdateDoiTacDto) {
      try {
        const { maDt, tenDt, ndId } = doiTac;
        const checkDtId = await prisma.doiTac.findFirst({
          where: {
            dtId,
            ndId,
            trangThai,
          },
        });
        if (checkDtId) {
          const { loaiDt } = checkDtId;
          const checkMa = await prisma.doiTac.findFirst({
            where: {
              maDt,
              loaiDt,
              ndId,
              trangThai,
              NOT: {
                dtId,
              },
            },
          });
          if (checkMa) {
            return myResponse(409, 'mã đối tác đã tồn tại', null);
          } else {
            const checkTen = await prisma.doiTac.findFirst({
              where: {
                tenDt,
                loaiDt,
                ndId,
                trangThai,
                NOT: {
                  dtId,
                },
              },
            });
            if (checkTen) {
              return myResponse(409, 'tên đối tác đã tồn tại', null);
            } else {
              const update = await prisma.doiTac.updateMany({
                data: doiTac,
                where: {
                  dtId,
                  ndId,
                  trangThai,
                },
              });
              if (update) {
                return myResponse(200, 'đã cập nhật', doiTac);
              }
            }
          }
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async delete(dtId: number) {
      try {
        const checkId = await prisma.doiTac.findFirst({
          where: {
            dtId,
            trangThai,
          },
        });
        console.log(typeof checkId);
        if (checkId) {
          const result = await prisma.doiTac.updateMany({
            data: {
              trangThai: 'xoá',
            },
            where: {
              dtId,
              trangThai,
            },
          });
          return myResponse(200, 'đã xoá đối tác', checkId);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async searchNpp(search: SearchDto) {
      try {
        const { keyword, ndId } = search;
        const result = await prisma.doiTac.findMany({
          where: {
            OR: [
              {
                maDt: {
                  contains: keyword,
                },
              },
              {
                tenDt: {
                  contains: keyword,
                },
              },
              {
                lienHe: {
                  contains: keyword,
                },
              },
              {
                phone: {
                  contains: keyword,
                },
              },
            ],
            loaiDt: 'npp',
            ndId,
            trangThai,
          },
        });
        if (result.length > 0) {
          return myResponse(200, 'kết quả tìm kiếm', result);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async searchKh(search: SearchDto) {
      try {
        const { keyword, ndId } = search;
        const result = await prisma.doiTac.findMany({
          where: {
            OR: [
              {
                maDt: {
                  contains: keyword,
                },
              },
              {
                tenDt: {
                  contains: keyword,
                },
              },
              {
                lienHe: {
                  contains: keyword,
                },
              },
              {
                phone: {
                  contains: keyword,
                },
              },
            ],
            loaiDt: 'kh',
            ndId,
            trangThai,
          },
        });
        if (result.length > 0) {
          return myResponse(200, 'kết quả tìm kiếm', result);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },
  };
  //theo dõi phiếu
  phieu = {
    async getPhieuNhap(ndId: number) {
      try {
        const phieuNhapMoiTao = await prisma.theoDoiPhieu.findMany({
          where: {
            loaiPhieu: 'pn',
            ndId,
            trangThai: 'mới tạo',
          },
          select: {
            pId: true,
            loaiPhieu: true,
            ngay: true,
            soPhieu: true,
            doiTac: {
              select: {
                tenDt: true,
                lienHe: true,
                phone: true,
                address: true,
              },
            },
            theoDoiChiTiet: {
              select: {
                tenSp: true,
                soLuong: true,
                donGia: true,
                thanhTien: true,
              },
              where: {
                trangThai: 'mới tạo',
              },
            },
          },
        });
        if (phieuNhapMoiTao.length > 0) {
          return myResponse(200, 'phiếu nhập mới tạo', phieuNhapMoiTao);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async getPhieuXuat(ndId: number) {
      try {
        const phieuXuatMoiTao = await prisma.theoDoiPhieu.findMany({
          where: {
            loaiPhieu: 'px',
            ndId,
            trangThai: 'mới tạo',
          },
          select: {
            pId: true,
            loaiPhieu: true,
            ngay: true,
            soPhieu: true,
            doiTac: {
              select: {
                tenDt: true,
                lienHe: true,
                phone: true,
                address: true,
              },
            },
            theoDoiChiTiet: {
              select: {
                tenSp: true,
                soLuong: true,
                donGia: true,
                thanhTien: true,
              },
              where: {
                trangThai: 'mới tạo',
              },
            },
          },
        });
        if (phieuXuatMoiTao.length > 0) {
          return myResponse(200, 'phiếu xuất mới tạo', phieuXuatMoiTao);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async addPhieu(phieuMoi: AddPhieuMoiDto) {
      try {
        const { loaiPhieu, ndId } = phieuMoi;
        //đếm số phiếu
        const count = await prisma.theoDoiPhieu.count({
          where: {
            loaiPhieu,
            ndId,
          },
        });
        const soPhieu = count + 1;
        const data = {
          ...phieuMoi,
          soPhieu,
          tongTien: 0,
          thanhToan: 0,
          conNo: 0,
          trangThai: 'mới tạo',
        };
        const addPhieu = await prisma.theoDoiPhieu.create({
          data,
        });
        return myResponse(200, 'đã tạo phiếu', addPhieu);
      } catch (error) {
        throw error;
      }
    },

    async savePhieu(savePhieu: SavePhieuDto) {
      try {
        const { loaiPhieu, soPhieu, thanhToan, ndId } = savePhieu;
        //đọc thông tin chi tiết của phiếu
        const chiTietPhieu = await prisma.theoDoiChiTiet.findMany({
          where: {
            loaiPhieu,
            soPhieu,
            ndId,
            trangThai: 'mới tạo',
          },
        });
        if (chiTietPhieu.length > 0) {
          //xử lý lưu phiếu
          if (loaiPhieu === 'pn') {
            for (let item of chiTietPhieu) {
              //cộng kho
              await prisma.sanPham.updateMany({
                data: {
                  tonKho: {
                    increment: item.soLuong,
                  },
                },
                where: {
                  spId: item.spId,
                  ndId,
                  trangThai,
                },
              });
            }
          } else {
            for (let item of chiTietPhieu) {
              //trừ kho
              await prisma.sanPham.updateMany({
                data: {
                  tonKho: {
                    decrement: item.soLuong,
                  },
                },
                where: {
                  spId: item.spId,
                  ndId,
                  trangThai,
                },
              });
            }
          }

          const tongTien = chiTietPhieu.reduce(
            (total, item) => total + Number(item.thanhTien),
            0,
          );
          const conNo = tongTien - thanhToan;

          await prisma.theoDoiPhieu.updateMany({
            data: {
              tongTien,
              thanhToan,
              conNo,
              trangThai: 'lưu',
            },
            where: {
              loaiPhieu,
              soPhieu,
              ndId,
              trangThai: 'mới tạo',
            },
          });
          await prisma.theoDoiChiTiet.updateMany({
            data: {
              trangThai: 'lưu',
            },
            where: {
              loaiPhieu,
              soPhieu,
              ndId,
              trangThai: 'mới tạo',
            },
          });
          return myResponse(200, 'đã lưu phiếu', soPhieu);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async delPhieu(pId: number) {
      try {
        const checkPId = await prisma.theoDoiPhieu.findFirst({
          where: {
            pId,
          },
        });
        if (checkPId) {
          const { loaiPhieu, soPhieu, ndId, trangThai } = checkPId;
          //trường hợp xoá phiếu mới tạo
          if (trangThai === 'mới tạo') {
            //xoá phiếu
            const xoaPhieu = await prisma.theoDoiPhieu.updateMany({
              data: {
                trangThai: 'xoá',
              },
              where: {
                pId,
                ndId,
                trangThai,
              },
            });
            //xoá chi tiết
            const checkChiTiet = await prisma.theoDoiChiTiet.findMany({
              where: {
                loaiPhieu,
                soPhieu,
                ndId,
                trangThai,
              },
            });
            if (checkChiTiet.length > 0) {
              const xoaChiTiet = await prisma.theoDoiChiTiet.updateMany({
                data: {
                  trangThai: 'xoá',
                },
                where: {
                  loaiPhieu,
                  soPhieu,
                  ndId,
                  trangThai,
                },
              });
            }
            return myResponse(200, 'đã xoá', checkPId);
          } else if (trangThai === 'lưu') {
            //trường hợp xoá phiếu đã lưu,
            //cần trừ kho
            //xoá phiếu
            const xoaPhieu = await prisma.theoDoiPhieu.updateMany({
              data: {
                trangThai: 'xoá',
              },
              where: {
                pId,
                ndId,
                trangThai,
              },
            });
            //xoá chi tiết
            const checkChiTiet = await prisma.theoDoiChiTiet.findMany({
              where: {
                loaiPhieu,
                soPhieu,
                ndId,
                trangThai,
              },
            });
            if (checkChiTiet.length > 0) {
              if (loaiPhieu === 'pn') {
                for (let item of checkChiTiet) {
                  const tonKho = await prisma.sanPham.updateMany({
                    data: {
                      tonKho: {
                        decrement: item.soLuong,
                      },
                    },
                    where: {
                      spId: item.spId,
                      ndId,
                    },
                  });
                }
              } else {
                for (let item of checkChiTiet) {
                  const tonKho = await prisma.sanPham.updateMany({
                    data: {
                      tonKho: {
                        increment: item.soLuong,
                      },
                    },
                    where: {
                      spId: item.spId,
                      ndId,
                    },
                  });
                }
              }
              const xoaChiTiet = await prisma.theoDoiChiTiet.updateMany({
                data: {
                  trangThai: 'xoá',
                },
                where: {
                  loaiPhieu,
                  soPhieu,
                  ndId,
                  trangThai,
                },
              });
            }
            return myResponse(200, 'đã xoá', checkPId);
          } else if (trangThai === 'xoá') {
            return myResponse(404, 'not found', null);
          }
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },
  };

  //theo dõi chi tiết
  chiTiet = {
    async addChiTiet(chiTiet: ChiTietDto) {
      const { soPhieu, loaiPhieu, spId, soLuong, donGia, ndId } = chiTiet;
      const sanPham = await prisma.sanPham.findFirst({
        where: {
          spId,
          ndId,
          trangThai: 'hoạt động',
        },
      });
      const thanhTien = soLuong * donGia;
      const checkP = await prisma.theoDoiPhieu.findFirst({
        where: {
          loaiPhieu,
          soPhieu,
          ndId,
          trangThai: 'mới tạo',
        },
      });
      if (checkP) {
        //check spId và giá có chưa, nếu có thì cộng dồn sl, chưa thì tạo mới
        const checkSpId = await prisma.theoDoiChiTiet.findFirst({
          where: {
            spId,
            donGia,
            loaiPhieu,
            soPhieu,
            ndId,
            trangThai: 'mới tạo',
          },
        });
        if (checkSpId) {
          const congdon = await prisma.theoDoiChiTiet.updateMany({
            data: {
              soLuong: {
                increment: soLuong,
              },
              thanhTien: {
                increment: thanhTien,
              },
            },
            where: {
              spId,
              loaiPhieu,
              soPhieu,
              ndId,
              trangThai: 'mới tạo',
            },
          });
        } else {
          const data = {
            ...chiTiet,
            tenSp: sanPham.tenSp,
            dtId: checkP.dtId,
            ngay: checkP.ngay,
            thanhTien,
            trangThai: 'mới tạo',
          };
          const addChiTiet = await prisma.theoDoiChiTiet.create({
            data,
          });
          return myResponse(200, 'đã thêm chi tiết nhập', addChiTiet);
        }
      } else {
        return myResponse(404, 'phiếu không tồn tại', null);
      }

      return chiTiet;
    },

    async readChiTietNhap(ndId: number) {
      try {
        const chiTiet = await prisma.theoDoiChiTiet.findMany({
          where: {
            loaiPhieu: 'pn',
            ndId,
            trangThai: 'lưu',
          },
          select: {
            loaiPhieu: true,
            ngay: true,
            soPhieu: true,
            tenSp: true,
            soLuong: true,
            donGia: true,
            thanhTien: true,
            doiTac: {
              select: {
                tenDt: true,
                lienHe: true,
                phone: true,
                address: true,
              },
            },
          },
          orderBy: {
            soPhieu: 'desc',
          },
        });
        if (chiTiet.length > 0) {
          return myResponse(200, 'chi tiết nhập', chiTiet);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },
    async readChiTietXuat(ndId: number) {
      try {
        const chiTiet = await prisma.theoDoiChiTiet.findMany({
          where: {
            loaiPhieu: 'px',
            ndId,
            trangThai: 'lưu',
          },
          select: {
            loaiPhieu: true,
            ngay: true,
            soPhieu: true,
            tenSp: true,
            soLuong: true,
            donGia: true,
            thanhTien: true,
            doiTac: {
              select: {
                tenDt: true,
                lienHe: true,
                phone: true,
                address: true,
              },
            },
          },
          orderBy: {
            soPhieu: 'desc',
          },
        });
        if (chiTiet.length > 0) {
          return myResponse(200, 'chi tiết xuất', chiTiet);
        } else {
          return myResponse(404, 'not found', null);
        }
      } catch (error) {
        throw error;
      }
    },

    async editChitiet(ctId: number){
      return 'sửa chi tiết'
    },

    async delChiTiet(ctId: number) {
      try {
        const chiTiet = await prisma.theoDoiChiTiet.findFirst({
          where: { ctId },
        });

        if (!chiTiet) {
          return myResponse(404, 'not found', null);
        }

        const {
          loaiPhieu,
          soPhieu,
          spId,
          soLuong,
          thanhTien,
          trangThai,
          ndId,
        } = chiTiet;

        if (trangThai === 'mới tạo' || trangThai === 'lưu') {
          await prisma.theoDoiChiTiet.updateMany({
            data: { trangThai: 'xoá' },
            where: { ctId },
          });

          if (loaiPhieu === 'pn') {
            // Trừ kho cho phiếu nhập
            await prisma.sanPham.updateMany({
              data: { tonKho: { decrement: soLuong } },
              where: { spId, ndId },
            });
          } else {
            // Tăng kho cho phiếu xuất
            await prisma.sanPham.updateMany({
              data: { tonKho: { increment: soLuong } },
              where: { spId, ndId },
            });
          }
          //trừ tiền
          await prisma.theoDoiPhieu.updateMany({
            data: {
              tongTien: {
                decrement: thanhTien,
              },
              conNo: {
                decrement: thanhTien,
              }
            },
            where: {
              soPhieu,
              loaiPhieu,
              trangThai,
              ndId,
            },
          });
        }
      } catch (error) {
        throw error;
      }
    },
  };
}

@Injectable()
export class NguoiDungService {
  constructor(private readonly jwtService: JwtService) {}
  //đăng ký
  async create(nguoiDung: NguoiDungDto) {
    try {
      const { taiKhoan } = nguoiDung;
      const checkTk = await prisma.nguoiDung.findFirst({
        where: {
          taiKhoan,
          trangThai,
        },
      });
      if (checkTk) {
        return myResponse(409, 'tài khoản đã tồn tại', taiKhoan);
      } else {
        const data = {
          ...nguoiDung,
          trangThai,
        };
        const result = await prisma.nguoiDung.create({
          data,
        });
        if (result) {
          return myResponse(200, 'đăng ký thành công', result);
        } else {
          return myResponse(400, 'lỗi rùi ku', null);
        }
      }
    } catch (error) {
      return error;
    }
  }
  //đăng nhập
  async dangNhap(dangNhap: DangNhapDto) {
    try {
      const { taiKhoan, matKhau } = dangNhap;
      const checkTk = await prisma.nguoiDung.findFirst({
        where: {
          taiKhoan,
          trangThai,
        },
      });
      if (checkTk) {
        //tài khoản hợp lệ, check tiếp mật khẩu
        const checkMk = await prisma.nguoiDung.findFirst({
          where: {
            taiKhoan,
            matKhau,
            trangThai,
          },
        });
        if (checkMk) {
          //đăng nhập thành công, trả token
          const { taiKhoan, email, phone, address, company, mst, avatar } =
            checkMk;
          const token = this.jwtService.sign(checkMk);
          const data = {
            taiKhoan,
            email,
            phone,
            address,
            company,
            mst,
            avatar,
            token,
          };
          return myResponse(200, 'đăng nhập thành công', data);
        } else {
          return myResponse(404, 'mật khẩu không đúng', null);
        }
      } else {
        //tài khoản không tồn tại
        return myResponse(404, 'tài khoản không đúng', taiKhoan);
      }
    } catch (error) {
      return error;
    }
  }
}

//chức năng chặn API khi chưa đăng nhập
@Injectable()
export class AuthBasic implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest(); //bắt được request
      const { token } = request.headers;
      if (token !== 'HELLO') {
        throw new UnauthorizedException('token không hợp lệ');
      }
      return true; //return true để next()
    } catch (error) {
      throw new UnauthorizedException('token không hợp lệ');
    }
  }
}
//chức năng chặn API khi đã đăng nhập
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest(); //bắt được request
      const { token } = request.headers;
      const verify = this.jwtService.verify(token); //verify token
      if (!verify) {
        throw new UnauthorizedException('token không hợp lệ');
      }
      return true; //return true để next()
    } catch (error) {
      throw new UnauthorizedException('token không hợp lệ');
    }
  }
}
