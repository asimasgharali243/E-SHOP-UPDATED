// controllers/ComparisionController.js
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { 
  scrapeDaraz, 
  scrapeIshopping, 
  scrapeShophive, 
  scrapeHomeshopping, 
  scrapeAmazon, 
  scrapeBestBuy,
  scrapeKhaadi,
  scrapeSanaSafinaz,
} from '../../utils/ScraperService.js';

puppeteer.use(StealthPlugin());

let browserInstance = null;
const getBrowserInstance = async () => {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({ 
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--lang=en-US,en",
      ]
    });
    console.log("Puppeteer browser instance launched.");
  }
  return browserInstance;
};

const inMemoryCache = {};
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

const logScrapingStatus = (results) => {
    console.log("\n--- Scraping Results Summary ---");
    results.forEach(result => {
        if (result.status === 'fulfilled') {
            if (result.value) {
                console.log(`✅ SUCCESS: ${result.value.site} found a product.`);
            } else {
                console.log(`❌ FAILED: A scraper ran but found no data.`);
            }
        } else {
            console.log(`❌ REJECTED: A scraper function threw an error.`);
            console.error(result.reason);
        }
    });
    console.log("------------------------------\n");
};

export const fetchProductComparisons = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  if (inMemoryCache[query] && Date.now() - inMemoryCache[query].timestamp < CACHE_EXPIRATION_MS) {
    console.log(`Serving query '${query}' from cache.`);
    return res.json(inMemoryCache[query].data);
  }

  const urlsToScrape = {
    "Daraz.pk": `https://www.daraz.pk/catalog/?q=${encodeURIComponent(query)}`,
    "iShopping.pk": `https://www.ishopping.pk/catalogsearch/result/?q=${encodeURIComponent(query)}`,
    "Shophive.com": `https://www.shophive.com/catalogsearch/result/?q=${encodeURIComponent(query)}`,
    "Homeshopping.pk": `https://homeshopping.pk/search.php?search_query=${encodeURIComponent(query)}`,
    "Amazon.com": `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
    "BestBuy.com": `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(query)}`,
    "Khaadi.com": `https://www.khaadi.com/pk/search/?q=${encodeURIComponent(query)}`,
    "SanaSafinaz.com": `https://www.sanasafinaz.com/pk/search/?q=${encodeURIComponent(query)}`
  };

  let browser;
  try {
    browser = await getBrowserInstance();
    console.log(`Starting fetching for query: '${query}'`);

    const scrapePromises = Object.entries(urlsToScrape).map(async ([siteName, url]) => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      
      let data = null;
      switch (siteName) {
        case "Daraz.pk":
          data = await scrapeDaraz(browser, url);
          break;
        case "iShopping.pk":
          data = await scrapeIshopping(browser, url);
          break;
        case "Shophive.com":
          data = await scrapeShophive(browser, url);
          break;
        case "Homeshopping.pk":
          data = await scrapeHomeshopping(browser, url);
          break;
        case "Amazon.com":
          data = await scrapeAmazon(browser, url);
          break;
        case "BestBuy.com":
          data = await scrapeBestBuy(browser, url);
          break;
        case "Khaadi.com":
          data = await scrapeKhaadi(browser, url);
          break;
        case "SanaSafinaz.com":
          data = await scrapeSanaSafinaz(browser, url);
          break;
        default:
          break;
      }
      return data;
    });

    const results = await Promise.allSettled(scrapePromises);
    logScrapingStatus(results);

    const products = results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);

    const finalResult = {
      query,
      products: products.length > 0 ? products : [],
      totalResults: products.length,
      note: products.length > 0 ? "Live data from web scraping" : "No products found or scraping failed for all sources."
    };

    inMemoryCache[query] = { data: finalResult, timestamp: Date.now() };

    res.json(finalResult);

  } catch (err) {
    console.error("Overall fetching error:", err);
    res.status(500).json({ 
      error: "Failed to fetch product comparisons",
      message: err.message
    });
  }
};