import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // GET /products — 고객용 활성 상품 목록 (?q=검색어&category=카테고리)
  @ApiOperation({ summary: '활성 상품 목록 조회' })
  @ApiQuery({ name: 'q', required: false, description: '검색어' })
  @ApiQuery({ name: 'category', required: false, description: '카테고리 필터' })
  @Get()
  findAll(@Query('q') q?: string, @Query('category') category?: string): Promise<Product[]> {
    return this.productsService.findAll(q, category);
  }

  // ⚠️ 주의: 문자열 경로('admin', 'ranking', 'trending')는 반드시 ':id' 위에 있어야 함
  // NestJS는 라우트를 위에서 아래 순서로 매칭하기 때문에
  // ':id'가 먼저 있으면 "admin", "ranking" 같은 문자열도 id로 인식해버림

  // GET /products/admin — 어드민용 전체 상품 목록 (비활성 포함)
  @ApiOperation({ summary: '[어드민] 전체 상품 목록 (비활성 포함)' })
  @Get('admin')
  findAllAdmin(): Promise<Product[]> {
    return this.productsService.findAllAdmin();
  }

  // GET /products/ranking — 실시간 랭킹 (salesCount 기준 상위 10개)
  @ApiOperation({ summary: '판매량 랭킹 상위 10개' })
  @Get('ranking')
  findRanking(): Promise<Product[]> {
    return this.productsService.findRanking();
  }

  // GET /products/trending — 요즘 주목 받는 상품 (viewCount 기준 상위 10개)
  @ApiOperation({ summary: '조회수 트렌딩 상위 10개' })
  @Get('trending')
  findTrending(): Promise<Product[]> {
    return this.productsService.findTrending();
  }

  // GET /products/:id — 상품 상세 조회 (viewCount +1 증가)
  @ApiOperation({ summary: '상품 상세 조회' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  // POST /products/upload — 이미지 파일 업로드 → Cloudinary URL 반환
  // FileInterceptor: multipart/form-data 요청에서 'file' 필드를 파싱
  // memoryStorage 사용 — 파일을 디스크 저장 없이 메모리(버퍼)로 처리
  @ApiOperation({ summary: '[어드민] 이미지 업로드 (Cloudinary)' })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const result = await this.cloudinaryService.uploadFile(file);
    // 업로드된 이미지의 URL만 반환 — 프론트에서 이 URL을 상품 이미지로 저장
    return { url: result.secure_url };
  }

  // POST /products — 상품 생성
  @ApiOperation({ summary: '[어드민] 상품 생성' })
  @Post()
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }

  // PATCH /products/:id — 상품 수정
  @ApiOperation({ summary: '[어드민] 상품 수정' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, dto);
  }

  // DELETE /products/:id — 상품 삭제
  @ApiOperation({ summary: '[어드민] 상품 삭제' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
