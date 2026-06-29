const { chromium } = require('./node_modules/playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  // HowItWorks section: scroll to Card 2
  await page.evaluate(() => window.scrollTo(0, 7375));
  await page.waitForTimeout(600);
  // Crop to just the Card 2 area (right column, card slot)
  const card = await page.$('[class*="card2"]');
  const box = card ? await card.boundingBox() : null;
  if (box) {
    await page.screenshot({ path: 'card2-path.png', clip: box });
  } else {
    await page.screenshot({ path: 'card2-path.png', fullPage: false });
  }
  await browser.close();
  console.log('Saved card2-path.png');
})();
