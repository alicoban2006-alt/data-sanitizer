# ⚡ DataPurge.dev — JSON & Text Data Sanitizer

> **Micro-SaaS Utility:** Geliştiriciler, DevOps mühendisleri ve veri analistleri için kirli metinleri, bozuk JSON'ları ve gizli Unicode karakterlerini anında temizleyen yüksek performanslı web aracı.

---

## 🎯 Özellikler

- **Bozuk JSON Onarımı:** Tırnaksız nesne anahtarları (`{key: "val"}`), tek tırnaklar, Python Boolean değerleri (`True`, `False`, `None`) ve fazlalık virgülleri otomatik onarır.
- **Görünmez Karakter & Zero-Width Avcısı:** Notion, Slack veya web sitelerinden kopyalanan görünmez `\u200B` (Zero-Width Space), `\uFEFF` (BOM) gibi derleyici patlatan karakterleri sıfırlar.
- **Akıllı Tırnak & Tipografi Düzeltme:** Curly quotes (`“ ”`, `‘ ’`) karakterlerini standart ASCII tırnaklara (`"`, `'`) çevirir.
- **Terminal & ANSI Temizliği:** Docker, Jest, Webpack loglarındaki renk kodlarını (`\x1b[32m...`) temizler.
- **Dizgi Unescape:** Veritabanı ve loglardaki kaçış karakterlerini (`\"`, `\\n`, `\\t`) unescape eder.
- **Hassas Veri Maskeleme:** JWT Bearer tokenları, API anahtarlarını ve e-postaları `[REDACTED]` ile maskeleme opsiyonu.
- **%100 İstemci Taraflı (Client-Side):** Veriler hiçbir sunucuya iletilmez, tamamen tarayıcı belleğinde güvenle işlenir.

---

## 🛠️ Yerel Geliştirme (Localhost)

Projeyi başlatmak için terminalde proje dizinine geçin:

```bash
cd "C:\Users\alico\.gemini\antigravity\scratch\data-sanitizer"

# Geliştirme sunucusunu başlat:
npm run dev

# veya Üretim (Production) derlemesi:
npm run build
npm run start
```

Tarayıcınızda açın: **`http://localhost:3000`**

---

## 🚀 Canlıya Dağıtım (Deploy Rehberi)

Bu proje **Next.js App Router** ile hazırlandığı ve tamamen istemci taraflı çalıştığı için **maliyetsiz (0 TL)** barındırılabilir:

### 1. Vercel ile Dağıtım (En Kolay & Önerilen):
1. Projenizi GitHub'a yükleyin:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for DataPurge micro-saas"
   git remote add origin https://github.com/<kullanici_adiniz>/datapurge.git
   git push -u origin main
   ```
2. [Vercel.com](https://vercel.com) adresine gidin.
3. **"Add New Project"** butonuna basarak bu depoyu seçin.
4. Framework olarak **Next.js** otomatik tanınacaktır. **"Deploy"** butonuna basın. Yaklaşık 45 saniyede ücretsiz `.vercel.app` alan adınızla canlıya geçer!

### 2. Cloudflare Pages ile Dağıtım:
- Cloudflare Pages panosunda depoyu bağlayın.
- Build command: `npm run build`
- Output directory: `.next`

---

## ☕ Bağış ve Gelir Modeli (Micro-SaaS)
Türkiye'den Stripe/PayPal kısıtlamalarına takılmamak adına modal içerisinde:
- **Ko-fi**
- **GitHub Sponsors**
- **Buy Me a Coffee**

bağlantıları hazır durumdadır. `src/components/SupportModal.tsx` içerisindeki profil URL'lerini kendinize göre güncelleyebilirsiniz.
