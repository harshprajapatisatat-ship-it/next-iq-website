import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${dir}/footer-desktop.png` });
// focused state + typed value
const input = page.locator('.curved-input__field');
await input.click();
await input.type('david@reactbits.dev', { delay: 20 });
await page.waitForTimeout(600);
await page.locator('[class*="curvedInputWrap"]').screenshot({ path: `${dir}/curvedinput-focus.png` });
await browser.close();
console.log('done');
