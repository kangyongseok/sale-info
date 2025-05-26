import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(products);
});

export default router;
