#!/usr/bin/env node

const { runSocialAgent } = require('./browser');
const logger = require('./logger');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const isHelp = args.includes('--help') || args.includes('-h');
const isViewPosts = args.includes('--view-posts');
const isLive = args.includes('--live');
const isHunt = args.includes('--hunt');
const isHeadless = args.includes('--headless');
const keepOpen = args.includes('--keep-open');
const singlePostIndex = args.indexOf('--single');
const singlePost = singlePostIndex !== -1 ? args[singlePostIndex + 1] : null;

if (isHelp) {
  console.log(`
DataPurge Autonomous Growth & Trial Agent

Usage:
  npm run agent -- [options]
  node automation/index.js [options]

Options:
  --hunt             🎯 SMART HUNT MODE: Deneme-yanılma yapar. Filtrelenen postu anında
                     otomatik siler, hesabınızı temiz tutar ve sonrakine geçer!
  --live             Canlı tekli paylaşım modu
  --dry-run          Test ve simülasyon modu (Butona basmaz)
  --single <sub_id>  Sadece tek bir subreddit dene (örn: --single Frontend)
  --view-posts       Aday toplulukları ve hazırlanan metinleri göster
  --keep-open        İşlem bitince tarayıcıyı açık bırak
  --help, -h         Yardım ekranını göster

Örnekler:
  npm run agent -- --hunt
  npm run agent -- --live --single devtools
  npm run agent -- --view-posts
`);
  process.exit(0);
}

if (isViewPosts) {
  const postsPath = path.join(__dirname, 'posts.json');
  const data = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

  logger.banner('ADAY TOPLULUKLAR & HAZIRLANAN METİNLER');
  (data.candidates || []).forEach((p, idx) => {
    console.log(`\x1b[36m[${idx + 1}] Hedef:\x1b[0m r/${p.subreddit}`);
    console.log(`\x1b[32mBaşlık:\x1b[0m ${p.title}`);
    console.log(`\x1b[2mGövde Özeti:\n${p.body.substring(0, 180)}...\n\x1b[0m`);
    console.log('------------------------------------------------------------\n');
  });
  process.exit(0);
}

runSocialAgent({
  dryRun: !isLive && !isHunt,
  hunt: isHunt,
  headless: isHeadless,
  singlePost,
  keepOpen,
});
