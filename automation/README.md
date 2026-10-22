# 🤖 DataPurge Community & Social Media Agent

DataPurge projesi için özel olarak tasarlanmış, **tam otomatize sosyal medya ve topluluk paylaşım ajanı**. 
Reddit (`r/webdev`, `r/SideProject`, `r/programming`) topluluklarında spam ya da yapay zeka kokmayan, geliştirici perspektifinden yazılmış organik içerikleri insan benzeri davranışlarla (human-like delays & typing) yayınlamak için geliştirilmiştir.

---

## 📁 Dosya Yapısı

```
automation/
├── posts.json          # Hazırlanmış 3 farklı organik, insan diliyle yazılmış post
├── browser.js          # Puppeteer tabanlı insan benzeri tarayıcı otomasyonu
├── logger.js           # Renkli konsol ve dosya loglama modülü (agent.log)
├── index.js            # Kullanıcı dostu CLI komut satırı arayüzü
├── session-profile/    # Tarayıcı çerezleri ve oturumun saklandığı profil dizini
└── screenshots/        # Paylaşım öncesi ve sonrası alınan ekran görüntüleri
```

---

## 🚀 Hızlı Başlangıç & Kullanım Komutları

Terminalde proje ana dizinindeyken:

### 1. Hazırlanan Postları ve Başlıkları İnceleyin:
```bash
npm run agent -- --view-posts
```

### 2. Güvenli Simülasyon (Dry-Run Modu - Önerilen):
Formları doldurur, insan benzeri yazım gecikmelerini simüle eder ve ekran görüntüsü alır, ancak **"Gönder" butonuna basmaz**.
```bash
npm run agent -- --dry-run
```

### 3. Tek Bir Topluluk İçin Test Edin:
```bash
npm run agent -- --single r-webdev
# veya
npm run agent -- --single r-SideProject
```

### 4. Canlı Yayınlama (Live Mode):
Hesap oturumunuz açık olduğunda gönderiyi gerçekten yayınlamak için:
```bash
npm run agent -- --live
```

---

## 🛡️ Anti-Bot ve Güvenlik Mekanizmaları

1. **İnsan Benzeri Yazım (Human Cadence Typing):**
   - Karakterler arasında 25ms - 85ms rastgele gecikmeler.
   - Noktalama işaretleri (`.`, `!`, `?`) ve satır sonlarında 200ms - 450ms düşünme duraklamaları.
2. **Kalıcı Tarayıcı Oturumu (`session-profile`):**
   - Kod üzerinden şifre girmek bot algılama sistemlerine takılır. Bunun yerine açılan tarayıcıda bir defa Reddit hesabınıza giriş yapmanız yeterlidir; oturumunuz `session-profile` içinde saklanır ve sonraki tüm çalıştırmalarda otomatik kullanılır.
3. **5 Dakikalık Otomatik Bekleme (Cooldown):**
   - Farklı sub-reddit'ler arasında bot engeline veya rate-limit cezalarına takılmamak için 300 saniyelik canlı geri sayım uygular.
4. **Loglama (`agent.log`):**
   - Her işlem zaman damgasıyla hem terminale renkli basılır hem de `automation/agent.log` dosyasına kaydedilir.
