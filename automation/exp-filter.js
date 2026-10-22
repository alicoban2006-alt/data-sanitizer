const puppeteer = require('puppeteer-core');
const path = require('path');

async function testPost(title, body, label) {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: false,
    userDataDir: path.join(__dirname, 'session-profile'),
    defaultViewport: null,
  });

  const page = (await browser.pages())[0];
  console.log(`[${label}] Navigating to r/test/submit...`);
  await page.goto('https://www.reddit.com/r/test/submit', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2500));

  // 1. Fill Title
  await page.evaluate((tText) => {
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
      t.value = tText;
      t.dispatchEvent(new Event('input', { bubbles: true }));
      t.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, title);

  await new Promise((r) => setTimeout(r, 1000));

  // 2. Click body composer and type body
  const composer = await page.$('#post-composer_bodytext');
  if (composer) {
    const box = await composer.boundingBox();
    await page.mouse.click(box.x + 50, box.y + 85);
    await new Promise((r) => setTimeout(r, 600));
    await page.keyboard.type(body, { delay: 15 });
  }

  await new Promise((r) => setTimeout(r, 1500));

  // 3. Click Post
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

  console.log(`[${label}] Post submitted! Waiting 70 seconds to observe full asynchronous filter check...`);
  await new Promise((r) => setTimeout(r, 70000));

  const postUrl = page.url();
  const filterResult = await page.evaluate(() => {
    const txt = document.body.innerText.toLowerCase();
    const removed =
      txt.includes('kaldırıldı') ||
      txt.includes('filtreler tarafından kaldırıldı') ||
      txt.includes('removed by reddit');
    return {
      isRemoved: removed,
    };
  });

  console.log(`[${label}] Result at 70s (${postUrl}):`, filterResult);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', `exp-${label}.png`) });

  await browser.close();
  return { postUrl, ...filterResult };
}

(async () => {
  // Experiment: Pure developer discussion with GitHub link (no vercel string at all)
  const title = `Exploring zero-width space regex performance in JavaScript`;
  const body = `Hey all,\n\nI was testing regex patterns for detecting zero-width unicode characters (\\u200B, \\u200C, \\uFEFF) in dirty JSON strings.\n\nOpen source demo repository: https://github.com/alicoban2006-alt/data-sanitizer\n\nCurious what edge cases you encounter with invisible whitespace in API payloads.`;

  await testPost(title, body, 'github-test');
})();
