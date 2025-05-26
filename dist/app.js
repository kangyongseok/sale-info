"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const products_1 = __importDefault(require("./routes/products"));
const scheduler_1 = require("./scheduler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use('/products', products_1.default);
app.get('/', (req, res) => {
    res.send('이마트 세일 상품 크롤러 서버');
});
app.listen(PORT, () => {
    console.log(`서버 실행중: http://localhost:${PORT}`);
    (0, scheduler_1.startScheduler)();
});
