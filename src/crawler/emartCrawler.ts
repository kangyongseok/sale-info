import { chromium } from 'playwright';

export type ProductType = {
  name: string;
  price: string;
  salePrice?: string; // 할인가
  oldPrice?: string; // 정상가(원가)
  discountRate?: string; // 할인율
  brand?: string; // 브랜드
  title?: string; // 상품명(브랜드 제외)
  imageUrl?: string;
  detailUrl?: string;
  reviewScore?: string; // 평점
  reviewCount?: string; // 리뷰 개수
};

export const crawlEmartSale = async (): Promise<ProductType[]> => {
  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      locale: 'ko-KR',
    });
    const page = await context.newPage();
    await page.goto('https://emart.ssg.com/sale/main.ssg', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForSelector('.sale_wrap', { timeout: 15000 });

    // 1. HTML 전체 길이 및 일부 출력
    const html = await page.content();
    console.log('HTML 전체 길이:', html.length);
    console.log('HTML 일부(앞 1000자):', html.slice(0, 1000));

    // 2. 주요 DOM 구조 확인
    const realTimeSaleExists = await page.$('.sale_wrap');
    console.log('.sale_wrap 영역:', !!realTimeSaleExists);

    // 3. 상품 셀렉터 결과 개수 확인
    const itemCount = await page.evaluate(
      () => document.querySelectorAll('.sale_wrap .mnemitem_grid_item').length
    );
    console.log('.sale_wrap .mnemitem_grid_item 개수:', itemCount);

    // 4. 상품 정보 추출 및 각 상품 로그
    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('.sale_wrap .mnemitem_grid_item');
      const result: any[] = [];
      items.forEach((li) => {
        const anchor = li.querySelector('a.emitem_info.clickable');
        if (!anchor) return;

        const brand =
          anchor.querySelector('.mnemitem_goods_brand')?.textContent?.trim() ||
          '';
        const title =
          anchor.querySelector('.mnemitem_goods_tit')?.textContent?.trim() ||
          '';
        const name = (brand ? brand + ' ' : '') + title;

        // 원가(정상가) - 없으면 ''
        const oldPriceNode = anchor.querySelector('.old_price .ssg_price');
        const oldPrice = oldPriceNode ? oldPriceNode.textContent?.trim() : '';

        // 할인가(판매가) - 없으면 ''
        const salePriceNode = anchor.querySelector('.new_price .ssg_price');
        const salePrice = salePriceNode
          ? salePriceNode.textContent?.trim()
          : '';

        // 할인율 - 없으면 ''
        const discountNode = anchor.querySelector(
          '.mnemitem_prd_per span:last-child'
        );
        const discountRate = discountNode
          ? discountNode.textContent?.trim()
          : '';

        // 이미지
        const imageUrl =
          li
            .querySelector('.mnemitem_thmb_imgbx_v2 img')
            ?.getAttribute('src') || '';

        // 상세 링크
        const detailUrl = anchor.getAttribute('href') || '';

        // 리뷰 정보
        const reviewScore =
          anchor
            .querySelector('.mnemitem_review_score .review_text')
            ?.textContent?.trim() || '';
        const reviewCount = (() => {
          const nodes = anchor.querySelectorAll(
            '.mnemitem_review_score .review_text'
          );
          return nodes.length > 1 ? nodes[1].textContent?.trim() : '';
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

    await browser.close();
    console.log('최종 크롤링된 상품 개수:', products.length);
    return products;
  } catch (err) {
    console.error('크롤링 중 에러 발생:', err);
    if (browser) await browser.close();
    return [];
  }
};
