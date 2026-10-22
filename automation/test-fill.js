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

  // Deep query helper that traverses shadowRoots
  const res = await page.evaluate(() => {
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

    const titleEl = queryDeep('textarea[name="title"]');
    if (!titleEl) return { success: false, msg: 'Title element not found' };

    titleEl.focus();
    titleEl.value = 'DataPurge: Fast In-Browser Data Sanitizer for Developers';
    titleEl.dispatchEvent(new Event('input', { bubbles: true }));
    titleEl.dispatchEvent(new Event('change', { bubbles: true }));

    // Now find body composer
    const composer = document.querySelector('shreddit-composer[name="body"]');
    let bodySet = false;
    if (composer) {
      const rte =
        composer.querySelector('[slot="rte"]') ||
        (composer.shadowRoot && composer.shadowRoot.querySelector('[role="textbox"]'));
      if (rte) {
        rte.focus();
        // Insert paragraph or text
        const p = rte.querySelector('p') || rte;
        p.textContent = 'Here is the body text filled automatically by DataPurge Social Agent!';
        rte.dispatchEvent(new Event('input', { bubbles: true }));
        bodySet = true;
      }
    }

    return {
      success: true,
      titleSet: true,
      bodySet,
    };
  });

  console.log('Fill result:', res);
  await new Promise((r) => setTimeout(r, 2000));
  const shotPath = path.join(__dirname, 'screenshots', 'fill-success.png');
  await page.screenshot({ path: shotPath });
  console.log('Screenshot saved to:', shotPath);

  await browser.close();
})();
