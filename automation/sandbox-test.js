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
  console.log('Navigating to r/test/submit (Sandbox)...');
  await page.goto('https://www.reddit.com/r/test/submit', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  // 1. Fill Title
  await page.evaluate(() => {
    function queryDeep(sel, root = document.body) {
      if (!root) return null;
      const m = root.querySelector && root.querySelector(sel);
      if (m) return m;
      for (const c of root.querySelectorAll ? root.querySelectorAll('*') : []) {
        if (c.shadowRoot) {
          const f = queryDeep(sel, c.shadowRoot);
          if (f) return f;
        }
      }
      return null;
    }
    const t = queryDeep('textarea[name="title"]');
    if (t) {
      t.focus();
      t.value = 'Testing linkless developer utility: DataPurge';
      t.dispatchEvent(new Event('input', { bubbles: true }));
      t.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise((r) => setTimeout(r, 1200));

  // 2. Click body composer and type plaintext domain (no https:// protocol)
  const composer = await page.$('#post-composer_bodytext');
  if (composer) {
    const box = await composer.boundingBox();
    await page.mouse.click(box.x + 50, box.y + 85);
    await new Promise((r) => setTimeout(r, 600));

    // Type text with plain domain (no clickable https://)
    await page.keyboard.type(
      'Hey all, testing client-side tool to clean zero-width unicode and format JSON.\n\nTool address: data-sanitizer-pied.vercel.app\n\nNo active link, testing filter bypass.',
      { delay: 10 }
    );
  }

  await new Promise((r) => setTimeout(r, 2000));

  // 3. Submit
  console.log('Submitting test post on r/test...');
  await page.evaluate(() => {
    function queryDeep(fn, root = document.body) {
      if (!root) return null;
      for (const el of root.querySelectorAll ? root.querySelectorAll('*') : []) {
        if (fn(el)) return el;
        if (el.shadowRoot) {
          const f = queryDeep(fn, el.shadowRoot);
          if (f) return f;
        }
      }
      return null;
    }
    const btn = queryDeep((el) => {
      const txt = (el.innerText || el.textContent || '').trim().toLowerCase();
      return (txt === 'paylaşım' || txt === 'paylaş' || txt === 'post') && !el.disabled;
    });
    if (btn) btn.click();
  });

  console.log('Post submitted. Waiting 25 seconds to observe Reddit spam filter reaction...');
  await new Promise((r) => setTimeout(r, 25000));

  // 4. Check if removed
  const filterResult = await page.evaluate(() => {
    const txt = document.body.innerText.toLowerCase();
    const removed =
      txt.includes('kaldırıldı') ||
      txt.includes('filtreler tarafından kaldırıldı') ||
      txt.includes('removed by reddit') ||
      txt.includes('sorry, this post has been removed');
    return {
      url: window.location.href,
      isRemoved: removed,
    };
  });

  console.log('Filter Result on r/test:', filterResult);

  const shotPath = path.join(__dirname, 'screenshots', 'sandbox-test.png');
  await page.screenshot({ path: shotPath });
  console.log('Screenshot saved:', shotPath);

  await browser.close();
})();
