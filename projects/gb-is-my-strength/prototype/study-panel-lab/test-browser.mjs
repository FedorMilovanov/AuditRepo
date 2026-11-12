import { launch } from './browser.mjs';
const browser = await launch();
const page = await browser.newPage();
await page.setContent('<html><body style="font:24px serif;background:#fdfcf9">Привет, мир</body></html>');
await page.screenshot({path:'/tmp/test.png'});
console.log('screenshot ok');
await browser.close();
