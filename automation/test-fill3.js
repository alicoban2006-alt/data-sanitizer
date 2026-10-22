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
  console.log('Navigating to r/SideProject/submit...');
  await page.goto('https://www.reddit.com/r/SideProject/submit', {
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
      t.value = 'I built DataPurge: Fast In-Browser Data Sanitizer for Developers';
      t.dispatchEvent(new Event('input', { bubbles: true }));
      t.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  console.log('Title filled. Now clicking body composer...');
  await new Promise((r) => setTimeout(r, 1000));

  // 2. Click the body composer using Puppeteer's native click
  const composer = await page.$('#post-composer_bodytext');
  if (composer) {
    const box = await composer.boundingBox();
    if (box) {
      // Click slightly inside the box
      await page.mouse.click(box.x + 30, box.y + 30);
      console.log('Clicked inside body composer.');
      await new Promise((r) => setTimeout(r, 500));

      // Type body via keyboard
      await page.keyboard.type('Hey r/SideProject,\n\nI built DataPurge: https://datapurge.dev\n\nHope you find it useful!', { delay: 10 });
      console.log('Typed into body via keyboard!');
    }
  }

  await new Promise((r) => setTimeout(r, 2000));

  // 3. Check if submit button is enabled!
  const submitInfo = await page.evaluate(() => {
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
      return txt === 'paylaşım' || txt === 'paylaş' || txt === 'post';
    });
    if (btn) {
      return {
        found: true,
        text: btn.innerText,
        disabled: btn.hasAttribute('disabled') || btn.disabled,
      };
    }
    return { found: false };
  });

  console.log('Submit button info:', submitInfo);

  const shotPath = path.join(__dirname, 'screenshots', 'native-click-fill.png');
  await page.screenshot({ path: shotPath });
  console.log('Screenshot saved to:', shotPath);

  await browser.close();
})();
