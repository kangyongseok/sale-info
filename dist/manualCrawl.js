"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const emartCrawler_1 = require("./crawler/emartCrawler");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, emartCrawler_1.crawlEmartSale)();
    // 1. 기존 상품 전체 삭제
    yield prisma.product.deleteMany({});
    // 2. 새로 크롤링한 상품 저장
    let savedCount = 0;
    for (const p of products) {
        try {
            yield prisma.product.create({
                data: Object.assign(Object.assign({}, p), { price: p.salePrice || p.oldPrice || '' }),
            });
            savedCount++;
        }
        catch (err) {
            console.error('DB 저장 실패:', err);
        }
    }
    console.log(`[${new Date().toISOString()}] 실제 DB에 저장된 상품 개수: ${savedCount}`);
});
run();
