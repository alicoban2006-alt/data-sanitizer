# ⚡ DataPurge — Client-Side JSON Repair, Text Sanitizer & Multi-Format Converter

[![Live Demo](https://img.shields.io/badge/Live%20Demo-data--sanitizer--pied.vercel.app-blue?style=for-the-badge&logo=vercel)](https://data-sanitizer-pied.vercel.app)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/alicoban)
[![Zero Telemetry](https://img.shields.io/badge/Privacy-100%25%20In--Browser%20Memory-brightgreen?style=for-the-badge)](https://data-sanitizer-pied.vercel.app)
[![Next.js 14](https://img.shields.io/badge/Built%20With-Next.js%2014%20%2B%20TailwindCSS-000000?style=for-the-badge&logo=next.js)](https://data-sanitizer-pied.vercel.app)

> **Live Production Tool:** [data-sanitizer-pied.vercel.app](https://data-sanitizer-pied.vercel.app)

An instant, high-performance in-browser utility built for software engineers, DevOps, and data analysts. Fix dirty text, unescape database logs, strip invisible zero-width unicode characters, repair broken JSON syntax, and convert bidirectionally between **JSON, YAML, XML, and CSV** with **0ms server latency and zero data leakage**.

---

## 🚀 Why DataPurge?

Every developer encounters the "silent copy-paste bug":
1. Copying payload samples from Notion, Slack, or Google Docs introduces invisible zero-width spaces (`\u200B`, `\u200C`, `\uFEFF`) or smart quotes (`“`, `”`) that crash JSON parsers and database inserts.
2. Online formatting utilities send your sensitive customer data, secret API keys, and internal logs to their servers or bombard you with video ads.

**DataPurge runs 100% inside your browser's Web Worker / JavaScript memory.** No network requests are made with your payload.

---

## ✨ Key Capabilities

### 1. 🧹 Deep Text & JSON Sanitization
- **Invisible Character Stripper:** Strips zero-width spaces (`\u200B`), zero-width non-joiners (`\u200C`), byte order marks (`\uFEFF`), and rogue control characters.
- **Smart Quote Normalizer:** Converts curly typographic quotes (`“`, `”`, `‘`, `’`) into valid code quotes (`"`, `'`).
- **ANSI Escape Code Cleaner:** Removes terminal color codes (`\x1b[31m`) from pasted server logs.
- **Auto JSON Repair:** Adds missing quotes around unquoted object keys, strips illegal trailing commas, and normalizes Python `True`/`False`/`None` into JSON `true`/`false`/`null`.
- **Secret & Token Masking:** Automatically detects and redacts JWTs, Bearer tokens, passwords, and private API keys before you share logs.

### 2. 🔄 Real-Time Multi-Format Converter
- **Bidirectional Conversion:** JSON ↔ YAML ↔ XML ↔ CSV.
- **One-Click Format Swap (`Swap ⇄`):** Instantly switch input and output targets.
- **Streaming Syntax Validation:** Real-time syntax feedback and human-friendly error highlights.

### 3. 📊 Live Telemetry Dashboard
- Instant byte count and size comparison.
- Optimization ratio and error counters.
- Sub-2ms execution time metrics.

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/alicoban2006-alt/data-sanitizer.git
cd data-sanitizer

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Privacy & Security Guarantee

All parsing, sanitizing, and conversions execute strictly on the client side using browser JavaScript engines. Nothing is ever logged or transmitted.

---

## 📄 License

MIT License. Free and open source for developers worldwide.
