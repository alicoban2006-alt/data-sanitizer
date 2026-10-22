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

  await new Promise((r) => setTimeout(r, 1000));

  // 2. Click Markdown button
  console.log('Finding and clicking Markdown button...');
  const clickedMd = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const mdBtn = buttons.find((b) => (b.innerText || '').toLowerCase().includes("markdown"));
    if (mdBtn) {
      mdBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Markdown button:', clickedMd);

  await new Promise((r) => setTimeout(r, 1500));

  // 3. Inspect what textarea or inputs exist now for the body
  const bodyInfo = await page.evaluate(() => {
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
    // Check all textareas
    const allT = Array.from(document.querySelectorAll('textarea'));
    return allT.map((t) => ({
      name: t.name,
      ph: t.placeholder,
      id: t.id,
      className: t.className,
      value: t.value,
    }));
  });
  console.log('Textareas after MD switch:', bodyInfo);

  // If there's a textarea with placeholder or name body:
  await page.evaluate(() => {
    const textareas = Array.from(document.querySelectorAll('textarea'));
    // The second or non-title textarea is the body!
    const bodyT = textareas.find((t) => t.name !== 'title' && t.name !== 'q');
    if (bodyT) {
      bodyT.focus();
      bodyT.value = 'Hey r/SideProject,\n\nI built DataPurge to clean dirty JSON, YAML, and XML in real time.\n\nCheck it out: https://datapurge.dev';
      bodyT.dispatchEvent(new Event('input', { bubbles: true }));
      bodyT.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise((r) => setTimeout(r, 2000));

  const shotPath = path.join(__dirname, 'screenshots', 'md-mode-test.png');
  await page.screenshot({ path: shotPath });
  console.log('Saved screenshot:', shotPath);

  await browser.close();
})();
