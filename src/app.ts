import express from 'express';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import { startScheduler } from './scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/products', productsRouter);

app.get('/', (req, res) => {
  res.send('이마트 세일 상품 크롤러 서버');
});

app.listen(PORT, () => {
  console.log(`서버 실행중: http://localhost:${PORT}`);
  startScheduler();
});
