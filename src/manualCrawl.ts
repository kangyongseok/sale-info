import { crawlEmartSale } from './crawler/emartCrawler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const run = async () => {
  const products = await crawlEmartSale();

  // 1. 기존 상품 전체 삭제
  await prisma.product.deleteMany({});

  // 2. 새로 크롤링한 상품 저장
  let savedCount = 0;
  for (const p of products) {
    try {
      await prisma.product.create({
        data: {
          ...p,
          price: p.salePrice || p.oldPrice || '', // salePrice 우선, 없으면 oldPrice, 둘 다 없으면 ''
        },
      });
      savedCount++;
    } catch (err) {
      console.error('DB 저장 실패:', err);
    }
  }

  console.log(
    `[${new Date().toISOString()}] 실제 DB에 저장된 상품 개수: ${savedCount}`
  );
};

run();
