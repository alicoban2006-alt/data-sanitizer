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
  const urls = [
    'https://www.reddit.com/r/test/comments/1xch9t7/testing_linkless_developer_utility_datapurge/',
    'https://www.reddit.com/r/devtools/comments/1xch5e5/made_a_quick_clientside_tool_to_clean_broken_json/'
  ];

  for (const url of urls) {
    console.log(`\nChecking: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 3000));

    const status = await page.evaluate(() => {
      const txt = document.body.innerText.toLowerCase();
      const isRemoved =
        txt.includes('kaldırıldı') ||
        txt.includes('filtreler tarafından kaldırıldı') ||
        txt.includes('removed by reddit') ||
        txt.includes('sorry, this post has been removed') ||
        txt.includes('post was removed');
      
      // Let's find banners
      const banners = Array.from(document.querySelectorAll('[data-testid="post-banner"], [slot="banner"], faceplate-alert, shreddit-post-flair'))
        .map(b => b.innerText);

      // Check if upvote button / score is visible
      const score = document.querySelector('shreddit-post')?.getAttribute('score');

      return { isRemoved, banners, score };
    });

    console.log(`Status for ${url}:`, status);
    const filename = url.includes('/test/') ? 'status-test.png' : 'status-devtools.png';
    await page.screenshot({ path: path.join(__dirname, 'screenshots', filename) });
  }

  await browser.close();
})();
