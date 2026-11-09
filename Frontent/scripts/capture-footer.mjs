import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.locator(".eshop-footer").screenshot({ path: "../docs/screenshots/footer-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".eshop-footer").screenshot({ path: "../docs/screenshots/footer-mobile.png" });
} finally {
  await browser.close();
}
