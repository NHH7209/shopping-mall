// Seed 스크립트 — 화장품 예시 데이터를 DB에 한번에 삽입
// 실행: npm run seed
// TypeORM DataSource를 직접 사용 — NestJS 앱 전체를 띄우지 않아도 됨

import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import * as dotenv from 'dotenv';

// .env 파일 로드 — DB 연결 정보를 환경변수로 읽어오기
dotenv.config();

// TypeORM DataSource 직접 생성 — app.module.ts의 설정과 동일하게 맞춰야 함
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product, ProductImage],
  synchronize: false, // seed에선 false — 테이블 구조 변경 방지
});

// 화장품 예시 데이터
// 이미지 URL: Unsplash 무료 이미지 (w=800 으로 크기 지정)
const seedData = [
  {
    name: '수분 크림 (모이스처라이저)',
    description: '히알루론산이 풍부한 고보습 크림. 건조한 피부에 깊은 수분을 채워드립니다.',
    price: 38000,
    stock: 50,
    salesCount: 120,
    viewCount: 540,
    category: '스킨케어',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
  },
  {
    name: '비타민C 세럼',
    description: '고농축 비타민C로 피부 톤을 밝혀주는 안티에이징 세럼.',
    price: 55000,
    stock: 30,
    salesCount: 95,
    viewCount: 420,
    category: '에센스/세럼',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
  },
  {
    name: '저자극 클렌징 워터',
    description: '닦아내는 타입의 무향 클렌징 워터. 예민한 피부도 부담 없이 사용 가능합니다.',
    price: 21000,
    stock: 55,
    salesCount: 110,
    viewCount: 410,
    category: '클렌징',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
  },
  {
    name: 'SPF50+ 선크림',
    description: '자외선 차단지수 SPF50+/PA++++. 가볍고 촉촉한 선크림.',
    price: 28000,
    stock: 60,
    salesCount: 180,
    viewCount: 650,
    category: '선케어',
    imageUrl: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800&q=80',
  },
  {
    name: '레티놀 아이크림',
    description: '눈가 주름과 다크서클을 개선하는 레티놀 아이크림.',
    price: 48000,
    stock: 25,
    salesCount: 70,
    viewCount: 320,
    category: '스킨케어',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
  },
  {
    name: '콜라겐 마스크팩 (5매)',
    description: '콜라겐과 히알루론산이 함유된 집중 케어 시트 마스크.',
    price: 15000,
    stock: 100,
    salesCount: 250,
    viewCount: 920,
    category: '마스크팩',
    imageUrl: 'https://images.unsplash.com/photo-1597931752949-98c74b5b159f?w=800&q=80',
  },
  {
    name: '나이아신아마이드 에센스',
    description: '모공 축소와 미백에 효과적인 나이아신아마이드 10% 에센스.',
    price: 42000,
    stock: 35,
    salesCount: 88,
    viewCount: 390,
    category: '에센스/세럼',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
  },
  {
    name: '립 글로우 오일',
    description: '촉촉하고 윤기나는 입술을 위한 영양 립 오일.',
    price: 22000,
    stock: 55,
    salesCount: 160,
    viewCount: 570,
    category: '메이크업',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
  },
  {
    name: '클레이 딥 클렌징 팩',
    description: '모공 속 피지를 흡착하는 카올린 클레이 마스크.',
    price: 32000,
    stock: 40,
    salesCount: 105,
    viewCount: 430,
    category: '마스크팩',
    imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
  },
  {
    name: '펩타이드 넥 크림',
    description: '목과 데콜테 피부를 집중 케어하는 탄력 강화 크림.',
    price: 52000,
    stock: 20,
    salesCount: 45,
    viewCount: 210,
    category: '스킨케어',
    imageUrl: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&q=80',
  },
  {
    name: '글로우 하이라이터',
    description: '피부에 자연스러운 광채를 더해주는 파우더 하이라이터.',
    price: 29000,
    stock: 50,
    salesCount: 90,
    viewCount: 380,
    category: '메이크업',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
  },
  {
    name: '딥 모이스처 바디로션',
    description: '쉐어버터와 아르간 오일이 함유된 고보습 바디로션.',
    price: 23000,
    stock: 65,
    salesCount: 140,
    viewCount: 500,
    category: '바디케어',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
  },
  {
    name: '클리어 포어 세럼',
    description: '살리실산과 티트리 성분으로 트러블을 진정시키는 세럼.',
    price: 36000,
    stock: 30,
    salesCount: 80,
    viewCount: 350,
    category: '에센스/세럼',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
  },
  {
    name: '스칼프 케어 샴푸',
    description: '두피 유수분 밸런스를 맞춰주는 약산성 두피 케어 샴푸.',
    price: 26000,
    stock: 45,
    salesCount: 115,
    viewCount: 460,
    category: '헤어케어',
    imageUrl: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&q=80',
  },
  {
    name: '세라마이드 배리어 크림',
    description: '피부 장벽을 강화하는 세라마이드 복합체 함유 진정 크림.',
    price: 44000,
    stock: 35,
    salesCount: 60,
    viewCount: 280,
    category: '스킨케어',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
  },
  {
    name: '네추럴 립스틱',
    description: '발색력이 뛰어나고 촉촉한 마무리감을 주는 비건 립스틱.',
    price: 17000,
    stock: 75,
    salesCount: 220,
    viewCount: 840,
    category: '메이크업',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  },
];

async function seed() {
  // DB 연결
  await dataSource.initialize();
  console.log('DB 연결 성공');

  const productRepo = dataSource.getRepository(Product);
  const imageRepo = dataSource.getRepository(ProductImage);

  // 기존 데이터 삭제 — TRUNCATE로 전체 삭제 (CASCADE로 이미지도 함께 삭제)
  await dataSource.query('TRUNCATE TABLE product_images, products RESTART IDENTITY CASCADE');
  console.log('기존 데이터 삭제 완료');

  // 상품 + 이미지 순서대로 삽입
  for (const data of seedData) {
    // 1. 상품 기본 정보 저장
    const product = productRepo.create({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      salesCount: data.salesCount,
      viewCount: data.viewCount,
      category: data.category,
      isActive: true,
    });
    const savedProduct = await productRepo.save(product);

    // 2. 이미지 저장 — sortOrder: 0이 대표 이미지
    const image = imageRepo.create({
      url: data.imageUrl,
      sortOrder: 0,
      product: savedProduct,
    });
    await imageRepo.save(image);

    console.log(`✅ 상품 등록: ${data.name}`);
  }

  console.log('\n🎉 Seed 완료! 총 16개 상품이 등록됐습니다.');
  await dataSource.destroy(); // DB 연결 종료
}

seed().catch((err) => {
  console.error('Seed 실패:', err);
  process.exit(1);
});
