const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// Find default Chromium-based browser on Windows (Edge or Chrome)
function findBrowserExecutable() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check if the current post page has been flagged or removed by Reddit AutoMod
async function checkIfRemoved(page) {
  return await page.evaluate(() => {
    const text = document.body.innerText.toLowerCase();
    const isRemoved =
      text.includes('kaldırıldı') ||
      text.includes('filtreler tarafından kaldırıldı') ||
      text.includes('moderatörleri tarafından kaldırıldı') ||
      text.includes('removed by reddit') ||
      text.includes('removed by the moderators') ||
      text.includes('sorry, this post has been removed') ||
      text.includes('post was removed');

    return isRemoved;
  });
}

// Automatically delete a removed post so the user profile stays 100% clean
async function deleteCurrentPost(page) {
  try {
    // 1. Open shadowRoot overflow menu button
    await page.evaluate(() => {
      const menu = document.querySelector('shreddit-post-overflow-menu');
      if (menu && menu.shadowRoot) {
        const btn = menu.shadowRoot.querySelector('button');
        if (btn) btn.click();
      }
    });

    await sleep(800);

    // 2. Click "Sil" / delete inside shadowRoot menu items
    await page.evaluate(() => {
      const menu = document.querySelector('shreddit-post-overflow-menu');
      if (menu && menu.shadowRoot) {
        const item =
          menu.shadowRoot.querySelector('#post-overflow-delete div[role="menuitem"]') ||
          menu.shadowRoot.querySelector('#post-overflow-delete');
        if (item) item.click();
      }
    });

    await sleep(1200);

    // 3. Confirm in modal ("Evet, sil" or "Yes, delete")
    const deleted = await page.evaluate(() => {
      function queryDeepAll(sel, root = document.body) {
        let results = [];
        if (!root) return results;
        if (root.querySelectorAll) results.push(...Array.from(root.querySelectorAll(sel)));
        for (const c of root.querySelectorAll ? root.querySelectorAll('*') : []) {
          if (c.shadowRoot) results.push(...queryDeepAll(sel, c.shadowRoot));
        }
        return results;
      }

      const allButtons = queryDeepAll('button');
      const btn = allButtons.find((b) => {
        const t = (b.innerText || b.textContent || '').trim().toLowerCase();
        return t === 'evet, sil' || t === 'yes, delete' || t === 'sil' || t === 'delete';
      });

      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await sleep(2500);
    return deleted;
  } catch (err) {
    return false;
  }
}

async function runSocialAgent(options = {}) {
  const isDryRun = options.dryRun !== false; // Dry-run by default
  const isHuntMode = options.hunt === true;  // Smart trial-and-error hunt mode
  const executablePath = options.executablePath || findBrowserExecutable();
  const sessionDir = path.join(__dirname, 'session-profile');
  const screenshotsDir = path.join(__dirname, 'screenshots');
  const historyFile = path.join(__dirname, 'published-history.json');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  if (!executablePath) {
    logger.error('Uyumlu Edge/Chrome tarayıcısı bulunamadı.');
    return;
  }

  logger.banner(
    isHuntMode
      ? '🎯 SMART TRIAL-AND-ERROR AVCI MODU (Filtreleneni Otomatik Siler)'
      : isDryRun
      ? 'MOD: 🛡️ GÜVENLİ DRY-RUN (Önizleme)'
      : 'MOD: 🚀 CANLI PAYLAŞIM (LIVE)'
  );

  logger.info(`Tarayıcı yolu: ${executablePath}`);
  logger.info(`Oturum profili dizini: ${sessionDir}`);

  // Load posts
  const postsPath = path.join(__dirname, 'posts.json');
  if (!fs.existsSync(postsPath)) {
    logger.error(`posts.json bulunamadı: ${postsPath}`);
    return;
  }

  const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  const candidateList = postsData.candidates || [];

  if (candidateList.length === 0) {
    logger.warn('Aday subreddit listesi boş.');
    return;
  }

  // Filter if single post requested
  const targets = options.singlePost
    ? candidateList.filter((c) => c.subreddit.toLowerCase().includes(options.singlePost.toLowerCase()))
    : candidateList;

  logger.info(`${targets.length} adet aday topluluk test edilecek.`);

  // Launch browser with full screen & visible window
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    userDataDir: sessionDir,
    defaultViewport: null,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--start-maximized',
    ],
  });

  try {
    const page = (await browser.pages())[0] || (await browser.newPage());

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    for (let index = 0; index < targets.length; index++) {
      const item = targets[index];
      const communityName = `r/${item.subreddit}`;

      logger.info(`\n============================================================`);
      logger.info(`[Aday ${index + 1}/${targets.length}] Hedef: ${communityName}`);
      logger.info(`Başlık: "${item.title}"`);

      const submitUrl = `https://www.reddit.com/r/${item.subreddit}/submit`;
      logger.info(`Sayfaya gidiliyor: ${submitUrl}`);

      await page.goto(submitUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      await sleep(randomBetween(2500, 4000));

      // 1. Fill Title
      logger.info('Başlık alanı dolduruluyor...');
      const titleFilled = await page.evaluate((titleText) => {
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

        const titleEl = queryDeep('textarea[name="title"]') || queryDeep('[placeholder*="Başlık"]') || queryDeep('[placeholder*="Title"]');
        if (titleEl) {
          titleEl.focus();
          titleEl.value = titleText;
          titleEl.dispatchEvent(new Event('input', { bubbles: true }));
          titleEl.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        return false;
      }, item.title);

      if (!titleFilled) {
        logger.error(`Başlık alanı bulunamadı. ${communityName} kısıtlı veya üyelik istiyor olabilir. Sonrakine geçiliyor.`);
        continue;
      }

      await sleep(randomBetween(1000, 1500));

      // 2. Click and Fill Body
      logger.info('Açıklama / Gövde metni dolduruluyor...');
      const composer = await page.$('#post-composer_bodytext') || await page.$('shreddit-composer[name="body"]');

      if (composer) {
        const box = await composer.boundingBox();
        if (box) {
          await page.mouse.click(box.x + 50, box.y + 85);
          await sleep(randomBetween(400, 700));

          const paragraphs = item.body.split('\n');
          for (let p = 0; p < paragraphs.length; p++) {
            const line = paragraphs[p];
            if (line.length > 0) {
              await page.keyboard.type(line, { delay: randomBetween(8, 20) });
            }
            if (p < paragraphs.length - 1) {
              await page.keyboard.press('Enter');
              await sleep(randomBetween(100, 200));
            }
          }
        }
      }

      await sleep(randomBetween(1500, 2500));

      // Screenshot populated form
      const shotPath = path.join(screenshotsDir, `${item.subreddit}-${Date.now()}.png`);
      await page.screenshot({ path: shotPath });

      // Handle submission
      if (isDryRun && !isHuntMode) {
        logger.info(`🛡️ [DRY-RUN]: Form dolduruldu, butona basılmadı.`);
        continue;
      }

      // Live submission
      logger.info('🚀 "Paylaşım" butonuna tıklanıyor...');
      const submitClicked = await page.evaluate(() => {
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
          return (txt === 'paylaşım' || txt === 'paylaş' || txt === 'post') && !el.hasAttribute('disabled') && !el.disabled;
        });

        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });

      if (!submitClicked) {
        logger.warn(`"Paylaşım" butonu aktifleşmedi. ${communityName} flairs/etiket zorunlu tutuyor olabilir. Sonrakine geçiliyor.`);
        continue;
      }

      logger.info('Post gönderildi. Reddit asenkron spam filtresini gözlemlemek için 65 saniye bekleniyor...');
      await sleep(65000);

      // Check if removed by Reddit filters
      const wasRemoved = await checkIfRemoved(page);

      if (wasRemoved) {
        logger.warn(`⚠️ Post ${communityName} filtreleri tarafından kaldırıldı!`);
        logger.info('🗑️ Hesabınızı temiz tutmak için post otomatik siliniyor...');

        const deleted = await deleteCurrentPost(page);
        if (deleted) {
          logger.success('✓ Kaldırılan post profilden başarıyla silindi (Profiliniz tertemiz kaldı).');
        } else {
          logger.warn('Otomatik silme menüsü tıklanamadı; manuel olarak profilinizden silebilirsiniz.');
        }

        // Anti-Bot Cooldown before next trial
        if (index < targets.length - 1) {
          logger.cooldown(180, 'Bot engeline takılmamak için dinlenme süresi');
        }
      } else {
        // SUCCESS! Post stayed live!
        const liveUrl = page.url();
        logger.success(`🎉 BİNGO! Post ${communityName} üzerinde CANLI KALDI ve silinmedi!`);
        logger.success(`🔗 Canlı Gönderi Linki: ${liveUrl}`);

        // Save to published history
        let history = [];
        if (fs.existsSync(historyFile)) {
          try {
            history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
          } catch {}
        }
        history.push({
          subreddit: communityName,
          title: item.title,
          url: liveUrl,
          timestamp: new Date().toISOString(),
        });
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf8');

        // Since we got a live hit, take a well-deserved breather
        logger.info('Bir başarılı post elde edildi. Hesabı riske atmamak için 10 dakika bekleniyor...');
        if (index < targets.length - 1) {
          await logger.cooldown(600, 'Güvenli hesap bekleme süresi');
        }
      }
    }

    logger.success('\n✨ Ajan tüm aday toplulukları taradı ve işlemi bitirdi!');
  } catch (err) {
    logger.error(`Otomasyon sırasında hata: ${err.message}`);
  } finally {
    if (!options.keepOpen) {
      await sleep(3000);
      await browser.close();
      logger.info('Tarayıcı kapatıldı.');
    } else {
      logger.info('Tarayıcı açık bırakıldı.');
    }
  }
}

module.exports = { runSocialAgent };
