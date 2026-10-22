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
      t.value = 'DataPurge: Fast In-Browser Data Sanitizer for Developers';
      t.dispatchEvent(new Event('input', { bubbles: true }));
      t.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise((r) => setTimeout(r, 1200));

  // 2. Click inside the body editor (below toolbar at box.y + 85)
  const composer = await page.$('#post-composer_bodytext');
  if (composer) {
    const box = await composer.boundingBox();
    console.log('Composer box:', box);
    await page.mouse.click(box.x + 50, box.y + 85);
    await new Promise((r) => setTimeout(r, 600));

    // Type the post
    await page.keyboard.type(
      'Hey r/SideProject,\n\nI made DataPurge: an in-browser utility that cleans dirty JSON, unescapes logs, and converts YAML/XML/CSV without sending data to any server.\n\nFree tool: https://datapurge.dev',
      { delay: 10 }
    );
  }

  await new Promise((r) => setTimeout(r, 2000));

  // 3. Check submit button
  const canSubmit = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p = btns.find((b) => (b.innerText || '').trim().toLowerCase() === 'paylaşım');
    return p ? !p.disabled : false;
  });

  console.log('Is "Paylaşım" button active?', canSubmit);

  const shotPath = path.join(__dirname, 'screenshots', 'perfect-click.png');
  await page.screenshot({ path: shotPath });
  console.log('Saved screenshot to:', shotPath);

  await browser.close();
})();
