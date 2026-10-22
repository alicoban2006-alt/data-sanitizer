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
      t.value = 'I built DataPurge: an in-browser data sanitizer & converter';
      t.dispatchEvent(new Event('input', { bubbles: true }));
      t.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // 2. Click "Markdown'a geç" button
  console.log('Clicking Markdown switch...');
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
      return txt.includes("markdown'a geç") || txt.includes('switch to markdown');
    });
    if (btn) btn.click();
  });

  await new Promise((r) => setTimeout(r, 1500));

  // 3. Now fill the body (either textarea or contenteditable)
  const bodyFilled = await page.evaluate(() => {
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

    // After switching to markdown, it renders a textarea or shreddit-composer markdown
    const bodyArea =
      queryDeep('textarea[placeholder*="Gövde"]') ||
      queryDeep('textarea[placeholder*="Text"]') ||
      queryDeep('shreddit-composer textarea') ||
      queryDeep('div[role="textbox"]');

    if (bodyArea) {
      bodyArea.focus();
      if (bodyArea.tagName.toLowerCase() === 'textarea') {
        bodyArea.value = 'Hey r/SideProject,\n\nI built DataPurge to clean dirty data client-side.\n\nLink: https://datapurge.dev';
        bodyArea.dispatchEvent(new Event('input', { bubbles: true }));
        bodyArea.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        document.execCommand('insertText', false, 'Hey r/SideProject, I built DataPurge to clean dirty data client-side. Check it out: https://datapurge.dev');
      }
      return true;
    }
    return false;
  });

  console.log('Body filled status:', bodyFilled);
  await new Promise((r) => setTimeout(r, 2000));

  // 4. Check if submit button is enabled!
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
        className: btn.className,
      };
    }
    return { found: false };
  });

  console.log('Submit button info:', submitInfo);

  const shotPath = path.join(__dirname, 'screenshots', 'both-filled.png');
  await page.screenshot({ path: shotPath });
  console.log('Screenshot saved to:', shotPath);

  await browser.close();
})();
