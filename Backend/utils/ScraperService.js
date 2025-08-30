// services/scraperService.js
import * as cheerio from "cheerio";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getPageContent(browser, url) {
  let page;
  try {
    page = await browser.newPage();
    await page.setUserAgent(headers["User-Agent"]);
    await page.setViewport({ width: 1366, height: 768 });

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await delay(Math.random() * 2000 + 1000);

    const html = await page.content();
    return cheerio.load(html);
  } catch (error) {
    console.error(`Error fetching content for ${url}:`, error.message);
    return null;
  } finally {
    if (page) await page.close();
  }
}



export async function scrapeIshopping(browser, searchUrl) {
  const $ = await getPageContent(browser, searchUrl);
  if (!$) return null;
  try {
    const firstProductLink = $('li.product-item > div.product-item-info a.product-item-link').first().attr('href');
    if (!firstProductLink) {
        console.log(`iShopping: No product link found for ${searchUrl}`);
        return null;
    }
    const productPageUrl = firstProductLink;
    const productPage$ = await getPageContent(browser, productPageUrl);
    if (!productPage$) return null;
    const title = productPage$('h1.page-title').text().trim() || productPage$('h1.product-title').text().trim() || productPage$('meta[property="og:title"]').attr('content');
    const price = productPage$('.price').first().text().trim() || productPage$('.product-price').first().text().trim();
    const img = productPage$('img.gallery-placeholder__image').attr('src') || productPage$('img.product-image-photo').attr('src') || productPage$('meta[property="og:image"]').attr('content');
    return { site: "iShopping.pk", title, price, image: img, url: productPageUrl };
  } catch (e) {
    console.error(`iShopping.pk scraping failed for ${searchUrl}: ${e.message}`);
    return null;
  }
}

export async function scrapeShophive(browser, searchUrl) {
  const $ = await getPageContent(browser, searchUrl);
  if (!$) return null;
  try {
    // New selector for Shophive search results
    const firstProductLink = $('div.product-grid-item a.product-item-link').first().attr('href');
    if (!firstProductLink) {
        console.log(`Shophive: No product link found for ${searchUrl}`);
        return null;
    }
    const productPageUrl = firstProductLink;
    const productPage$ = await getPageContent(browser, productPageUrl);
    if (!productPage$) return null;
    const title = productPage$('h1.page-title').text().trim();
    const price = productPage$('span.price-wrapper').first().text().trim() || productPage$('span.product-price').first().text().trim();
    const img = productPage$('img.product-image-photo').first().attr('src');
    return { site: "Shophive.com", title, price, image: img, url: productPageUrl };
  } catch (e) {
    console.error(`Shophive.com scraping failed for ${searchUrl}: ${e.message}`);
    return null;
  }
}

export async function scrapeHomeshopping(browser, searchUrl) {
  const $ = await getPageContent(browser, searchUrl);
  if (!$) return null;
  try {
    // New selector for Homeshopping search results
    const firstProductLink = $('.product-box a').first().attr('href');
    if (!firstProductLink) {
        console.log(`Homeshopping: No product link found for ${searchUrl}`);
        return null;
    }
    const productPageUrl = firstProductLink;
    const productPage$ = await getPageContent(browser, productPageUrl);
    if (!productPage$) return null;
    const title = productPage$('h1[itemprop="name"]').text().trim();
    const price = productPage$('span[itemprop="price"]').first().text().trim();
    const img = productPage$('img.img-fluid').first().attr('src') || productPage$('img#zoom_01').attr('src');
    return { site: "Homeshopping.pk", title, price, image: img, url: productPageUrl };
  } catch (e) {
    console.error(`Homeshopping.pk scraping failed for ${searchUrl}: ${e.message}`);
    return null;
  }
}

export async function scrapeKhaadi(browser, searchUrl) {
  const $ = await getPageContent(browser, searchUrl);
  if (!$) return null;
  try {
    // New selector for Khaadi search results
    const firstProductLink = $('div.product-item-details a.product-item-link').first().attr('href');
    if (!firstProductLink) {
        console.log(`Khaadi: No product link found for ${searchUrl}`);
        return null;
    }
    const productPageUrl = firstProductLink;
    const productPage$ = await getPageContent(browser, productPageUrl);
    if (!productPage$) return null;
    const title = productPage$('h1.page-title span').text().trim();
    const price = productPage$('span.price').first().text().trim();
    const img = productPage$('img.gallery-image').first().attr('src');
    return { site: "Khaadi.com", title, price, image: img, url: productPageUrl };
  } catch (e) {
    console.error(`Khaadi.com scraping failed for ${searchUrl}: ${e.message}`);
    return null;
  }
}

export async function scrapeSanaSafinaz(browser, searchUrl) {
  const $ = await getPageContent(browser, searchUrl);
  if (!$) return null;
  try {
    // New selector for SanaSafinaz search results
    const firstProductLink = $('ol.products-grid > li > div > a.product-item-link').first().attr('href');
    if (!firstProductLink) {
        console.log(`SanaSafinaz: No product link found for ${searchUrl}`);
        return null;
    }
    const productPageUrl = firstProductLink;
    const productPage$ = await getPageContent(browser, productPageUrl);
    if (!productPage$) return null;
    const title = productPage$('h1.product-name').text().trim();
    const price = productPage$('span.product-price').first().text().trim();
    const img = productPage$('img.MagicZoomPlusImage').first().attr('src');
    return { site: "SanaSafinaz.com", title, price, image: img, url: productPageUrl };
  } catch (e) {
    console.error(`SanaSafinaz.com scraping failed for ${searchUrl}: ${e.message}`);
    return null;
  }
}

// Scrapers for Global E-commerce Sites
// services/amazonScraper.js
export async function scrapeAmazon(browser, productUrl) {
  let page;
  try {
    page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1366, height: 768 });

    await page.goto(productUrl, {
      waitUntil: "networkidle2", // wait for full page
      timeout: 60000,
    });

    // Wait for product title (or fallback)
    await page.waitForSelector("#productTitle, title", { timeout: 15000 });

    const product = await page.evaluate(() => {
      const getText = (sel) => {
        const el = document.querySelector(sel);
        return el ? el.innerText.trim() : "";
      };
      const getAttr = (sel, attr) => {
        const el = document.querySelector(sel);
        return el ? el.getAttribute(attr) : "";
      };

      const title =
        getText("#productTitle") ||
        getText("#titleSection span") ||
        document.title;

      const price =
        getText(".a-price .a-offscreen") ||
        getText("#priceblock_ourprice") ||
        getText("#priceblock_dealprice") ||
        getText(".a-color-price");

      const img =
        getAttr("#landingImage", "src") ||
        getAttr("#imgBlkFront", "src") ||
        getAttr(".imgTagWrapper img", "src");

      return { title, price, image: img };
    });

    return {
      site: "Amazon.com",
      ...product,
      url: productUrl,
    };
  } catch (err) {
    console.error(`Amazon scraping failed: ${err.message}`);
    return null;
  } finally {
    if (page) await page.close();
  }
}

export async function scrapeBestBuy(browser, searchUrl) {
  const $ = await getPageContent(browser, searchUrl);
  if (!$) return null;
  try {
    // New selector for Best Buy search results
    const firstProductLink = $('.list-results > li a.image-link').first().attr('href');
    if (!firstProductLink) {
        console.log(`Best Buy: No product link found for ${searchUrl}`);
        return null;
    }
    const productPageUrl = `https://www.bestbuy.com${firstProductLink}`;
    const productPage$ = await getPageContent(browser, productPageUrl);
    if (!productPage$) return null;
    const title = productPage$('div.sku-title > h1').text().trim();
    const price = productPage$('.priceView-hero-price.priceView-customer-price span[aria-hidden="true"]').first().text().trim();
    const img = productPage$('img.primary-image').first().attr('src');
    return { site: "BestBuy.com", title, price, image: img, url: productPageUrl };
  } catch (e) {
    console.error(`BestBuy.com scraping failed for ${searchUrl}: ${e.message}`);
    return null;
  }

}

export async function scrapeDaraz(browser, searchUrl, maxProducts = 5) {
  const $ = await getPageContent(browser, searchUrl);
  if (!$) return null;

  try {
    const productLinks = $('div.Bm3ON[data-qa-locator="product-item"] a')
      .map((i, el) => $(el).attr("href"))
      .get()
      .slice(0, maxProducts);

    const products = [];

    for (const link of productLinks) {
      const productPageUrl = link.startsWith("//") ? `https:${link}` : link;
      const productPage$ = await getPageContent(browser, productPageUrl);
      if (!productPage$) continue;

      const title = productPage$('h1.pdp-product-title').text().trim() ||
                    productPage$('span.pdp-mod-product-badge-title').text().trim() ||
                    productPage$('title').text().trim();

      const price = productPage$('span.pdp-price_key-value').first().text().trim() ||
                    productPage$('span.pdp-price').first().text().trim();

      const img = productPage$('div.pdp-mod-image img').attr("src") ||
                  productPage$('img.pdp-mod-main-img').attr("src");

      products.push({ site: "Daraz.pk", title, price, image: img, url: productPageUrl });
    }

    return products;
  } catch (err) {
    console.error(`Daraz scraping failed: ${err.message}`);
    return null;
  }
}

