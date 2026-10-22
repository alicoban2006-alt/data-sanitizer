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
  console.log('Navigating to user profile submitted tab...');
  await page.goto('https://www.reddit.com/user/clayexe/submitted/', { waitUntil: 'networkidle2', timeout: 30000 });
  
  await new Promise((r) => setTimeout(r, 4000));
  
  const postInfo = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('shreddit-post, article'));
    return articles.map((a) => {
      const title = a.getAttribute('post-title') || a.querySelector('h1, h2, a[slot="title"]')?.innerText;
      const sub = a.getAttribute('subreddit-prefixed-name') || '';
      const permalink = a.getAttribute('permalink') || '';
      return { title, sub, permalink };
    });
  });

  console.log('Found submitted posts:', JSON.stringify(postInfo, null, 2));
  
  const shotPath = path.join(__dirname, 'screenshots', 'profile-submitted.png');
  await page.screenshot({ path: shotPath });
  console.log('Screenshot saved to:', shotPath);
  
  await browser.close();
})();
