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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const emartCrawler_1 = require("./crawler/emartCrawler");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const startScheduler = () => {
    node_cron_1.default.schedule('0 12 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield (0, emartCrawler_1.crawlEmartSale)();
        for (const p of products) {
            yield prisma.product.create({ data: p });
        }
        console.log(`[${new Date().toISOString()}] 상품 자동 크롤링 완료`);
    }));
};
exports.startScheduler = startScheduler;
