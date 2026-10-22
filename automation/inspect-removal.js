const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: false,
    userDataDir: path.join(__dirname, 'session-profile'),
    defaultViewport: null,
  });

  const page = (await browser.pages())[0];
  const url = 'https://www.reddit.com/r/test/comments/1xch9t7/testing_linkless_developer_utility_datapurge/';
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 3000));

  const details = await page.evaluate(() => {
    // Look for any banner or alert
    const bannerElements = Array.from(document.querySelectorAll('shreddit-alert, faceplate-alert, [slot="banner"], div[role="alert"]'));
    const bannerTexts = bannerElements.map(el => el.innerText.trim());
    
    // Look for comments
    const comments = Array.from(document.querySelectorAll('shreddit-comment')).map(c => c.innerText.trim());
    
    // All visible text containing 'kaldırıldı' or 'removed'
    const allText = document.body.innerText;
    const lines = allText.split('\n').filter(l => 
      l.toLowerCase().includes('kaldırıldı') || 
      l.toLowerCase().includes('filtre') || 
      l.toLowerCase().includes('removed') ||
      l.toLowerCase().includes('moderator')
    );

    return { bannerTexts, comments, lines };
  });

  console.log('Details:', JSON.stringify(details, null, 2));
  await browser.close();
})();
