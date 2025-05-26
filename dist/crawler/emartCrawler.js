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
exports.crawlEmartSale = void 0;
const playwright_1 = require("playwright");
const crawlEmartSale = () => __awaiter(void 0, void 0, void 0, function* () {
    let browser;
    try {
        browser = yield playwright_1.chromium.launch({ headless: false });
        const context = yield browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1280, height: 800 },
            locale: 'ko-KR',
        });
        const page = yield context.newPage();
        yield page.goto('https://emart.ssg.com/sale/main.ssg', {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });
        yield page.waitForSelector('.sale_wrap', { timeout: 15000 });
        // 1. HTML 전체 길이 및 일부 출력
        const html = yield page.content();
        console.log('HTML 전체 길이:', html.length);
        console.log('HTML 일부(앞 1000자):', html.slice(0, 1000));
        // 2. 주요 DOM 구조 확인
        const realTimeSaleExists = yield page.$('.sale_wrap');
        console.log('.sale_wrap 영역:', !!realTimeSaleExists);
        // 3. 상품 셀렉터 결과 개수 확인
        const itemCount = yield page.evaluate(() => document.querySelectorAll('.sale_wrap .mnemitem_grid_item').length);
        console.log('.sale_wrap .mnemitem_grid_item 개수:', itemCount);
        // 4. 상품 정보 추출 및 각 상품 로그
        const products = yield page.evaluate(() => {
            const items = document.querySelectorAll('.sale_wrap .mnemitem_grid_item');
            const result = [];
            items.forEach((li) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                const anchor = li.querySelector('a.emitem_info.clickable');
                if (!anchor)
                    return;
                const brand = ((_b = (_a = anchor.querySelector('.mnemitem_goods_brand')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) ||
                    '';
                const title = ((_d = (_c = anchor.querySelector('.mnemitem_goods_tit')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) ||
                    '';
                const name = (brand ? brand + ' ' : '') + title;
                // 원가(정상가) - 없으면 ''
                const oldPriceNode = anchor.querySelector('.old_price .ssg_price');
                const oldPrice = oldPriceNode ? (_e = oldPriceNode.textContent) === null || _e === void 0 ? void 0 : _e.trim() : '';
                // 할인가(판매가) - 없으면 ''
                const salePriceNode = anchor.querySelector('.new_price .ssg_price');
                const salePrice = salePriceNode
                    ? (_f = salePriceNode.textContent) === null || _f === void 0 ? void 0 : _f.trim()
                    : '';
                // 할인율 - 없으면 ''
                const discountNode = anchor.querySelector('.mnemitem_prd_per span:last-child');
                const discountRate = discountNode
                    ? (_g = discountNode.textContent) === null || _g === void 0 ? void 0 : _g.trim()
                    : '';
                // 이미지
                const imageUrl = ((_h = li
                    .querySelector('.mnemitem_thmb_imgbx_v2 img')) === null || _h === void 0 ? void 0 : _h.getAttribute('src')) || '';
                // 상세 링크
                const detailUrl = anchor.getAttribute('href') || '';
                // 리뷰 정보
                const reviewScore = ((_k = (_j = anchor
                    .querySelector('.mnemitem_review_score .review_text')) === null || _j === void 0 ? void 0 : _j.textContent) === null || _k === void 0 ? void 0 : _k.trim()) || '';
                const reviewCount = (() => {
                    var _a;
                    const nodes = anchor.querySelectorAll('.mnemitem_review_score .review_text');
                    return nodes.length > 1 ? (_a = nodes[1].textContent) === null || _a === void 0 ? void 0 : _a.trim() : '';
                })();
                result.push({
                    name,
                    brand,
                    title,
                    oldPrice,
                    salePrice,
                    discountRate,
                    imageUrl,
                    detailUrl,
                    reviewScore,
                    reviewCount,
                });
            });
            return result;
        });
        yield browser.close();
        console.log('최종 크롤링된 상품 개수:', products.length);
        return products;
    }
    catch (err) {
        console.error('크롤링 중 에러 발생:', err);
        if (browser)
            yield browser.close();
        return [];
    }
});
exports.crawlEmartSale = crawlEmartSale;
