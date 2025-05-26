import cron from 'node-cron';
import { crawlEmartSale } from './crawler/emartCrawler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const startScheduler = () => {
  cron.schedule('0 12 * * *', async () => {
    const products = await crawlEmartSale();
    for (const p of products) {
      await prisma.product.create({ data: p });
    }
    console.log(`[${new Date().toISOString()}] 상품 자동 크롤링 완료`);
  });
};
