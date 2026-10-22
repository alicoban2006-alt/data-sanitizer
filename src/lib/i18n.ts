export type Language = 'en' | 'tr';

export const translations = {
  en: {
    // Brand & Header
    brandTitle: 'DataPurge',
    brandSubtitle: 'Instant data sanitizer & format converter for developers',
    badgePrivate: '100% Client-Side',
    buyCoffee: 'Buy me a coffee',
    supportDev: 'Support the project',
    tabSanitizer: 'Sanitizer & Repair',
    tabConverter: 'Format Converter',

    // Hero / Tagline (Human, engaging)
    heroBadge: 'Zero tracking • Runs entirely in your browser',
    heroTitle: 'Clean dirty data before it breaks production.',
    heroSubtitle: 'Strip hidden zero-width characters, repair mangled JSON, fix smart quotes, and convert YAML/XML/CSV in milliseconds.',

    // Sanitizer Toolbar
    loadSample: 'Load Sample',
    sampleScenarios: 'Sample Scenarios',
    twoSpaces: '2 Spaces',
    fourSpaces: '4 Spaces',
    minify: 'Minify',
    repairJson: 'Fix JSON',
    stripInvisible: 'Strip Hidden Chars',
    unescape: 'Unescape (\\")',
    filters: 'Options',
    clear: 'Clear',

    // Filter Options
    optSmartQuotes: 'Normalize smart quotes (“ ” → ")',
    optStripAnsi: 'Remove terminal ANSI colors',
    optNbsp: 'Fix non-breaking spaces (NBSP)',
    optTrim: 'Trim line whitespace',
    optComments: 'Remove comments (// /* */)',
    optMask: 'Mask API keys & emails',

    // Input Editor
    rawInput: 'Raw / Dirty Input',
    jsonDetected: 'JSON Detected',
    paste: 'Paste',
    inputPlaceholder: 'Paste your dirty text, broken JSON, terminal logs, or escaped database string here...\n\nExample:\n{\n  user_id: 10492,\n  \'username\': \'alex_dev\',\n  fullName: “Alex Morgan”,\n  isActive: True,\n  permissions: [\'admin\', \'deploy\',],\n}',
    chars: 'chars',
    lines: 'lines',
    pasteShortcut: 'Ctrl + V to paste',

    // Output Editor
    cleanedOutput: 'Sanitized Output',
    validJson: 'Valid JSON',
    plainText: 'Clean Text',
    textFormat: 'Text Format',
    download: 'Download',
    copy: 'Copy',
    copied: 'Copied!',
    outputPlaceholder: 'Your cleaned and formatted output will appear here in real-time...',
    realtimeSync: 'Instant local processing',

    // Fixes report
    fixesTitle: 'Fixes applied:',
    fixJsonRepaired: 'Repaired broken JSON keys & syntax',
    fixInvisibleRemoved: 'hidden/zero-width chars removed',
    fixQuotesNormalized: 'smart quotes normalized to ASCII',
    fixAnsiRemoved: 'terminal ANSI codes stripped',
    fixCommentsRemoved: 'comments removed',
    fixMasked: 'sensitive tokens/emails masked',

    // Converter Tab
    source: 'Source:',
    target: 'Target:',
    swap: 'Swap Source & Target',
    autoDetect: 'Auto',
    examples: 'Presets:',
    parseError: 'Parse / Conversion Error',
    parseHint: 'Make sure your source data is valid',
    converterInputPlaceholder: 'Paste your JSON, YAML, XML, or CSV data here to convert...',
    convertedBadge: 'Converted',

    // Telemetry / Stats Bar
    telemetryTitle: 'Live Telemetry & Diagnostics',
    telemetryLive: 'Live',
    telemetryZeroLag: 'Zero server latency',
    metricProcessed: 'Data Processed',
    metricFixes: 'Errors Fixed',
    metricFixesSub: 'Syntax & hidden chars',
    metricSizeChange: 'Size Optimization',
    metricSizeSaved: 'saved',
    metricSpeed: 'Processing Time',
    metricZeroNet: 'Local engine',
    metricPrivacy: 'Privacy Score',
    metricPrivacySub: 'Zero data leaves browser',

    // Footer & Value Props
    prop1Title: 'No Compiler Crashes',
    prop1Desc: 'Strips zero-width spaces (\\u200B) and curly quotes copied from Notion, Slack, or ChatGPT that secretly break your code.',
    prop2Title: '100% In-Browser Privacy',
    prop2Desc: 'No API calls, no backend, no analytics trackers. Your proprietary code and tokens never touch any server.',
    prop3Title: 'Multi-Format Engine',
    prop3Desc: 'Effortlessly switch between JSON, YAML, XML, and CSV with automatic structure detection and clean syntax formatting.',
    footerText: 'Built for developers who spend too much time fixing broken copy-pastes.',
    openSource: 'GitHub',

    // Support Modal
    coffeeTitle: 'Buy Me a Coffee',
    coffeeSubtitle: 'Fuel future updates & keep this tool ad-free',
    coffeeBody: 'DataPurge is a free, privacy-first utility that runs completely inside your browser. If it saved you debugging time today, consider buying me a coffee!',
    kofiTitle: 'Support via Ko-fi',
    kofiSub: 'Zero fees & international credit card support',
    githubSponsorsTitle: 'GitHub Sponsors',
    githubSponsorsSub: 'Direct developer sponsorship',
    bmacTitle: 'Buy Me a Coffee',
    bmacSub: 'Quick & simple one-time tip',
    modalTip: 'Customize profile links in SupportModal.tsx',
    copyLink: 'Copy',
    linkCopied: 'Copied',

    // Toasts
    toastCopied: 'Copied to clipboard!',
    toastCopyFailed: 'Failed to copy.',
    toastPasted: 'Pasted from clipboard.',
    toastPasteDenied: 'Clipboard access denied.',
    toastCleared: 'Cleared.',
    toastDownloaded: 'downloaded.',
    toastSampleLoaded: 'Sample loaded.',
    toastSwapped: 'Swapped source and target formats.',
  },

  tr: {
    // Marka & Başlık
    brandTitle: 'DataPurge',
    brandSubtitle: 'Geliştiriciler için anlık veri temizleyici ve format dönüştürücü',
    badgePrivate: '%100 İstemci Taraflı',
    buyCoffee: 'Bir kahve ısmarla',
    supportDev: 'Projeyi Destekle',
    tabSanitizer: 'Temizleyici & Onarıcı',
    tabConverter: 'Format Dönüştürücü',

    // Hero / Başlık
    heroBadge: 'Sıfır izleme • Tamamen tarayıcınızda çalışır',
    heroTitle: 'Kirli veriyi uygulamanızı patlatmadan önce temizleyin.',
    heroSubtitle: 'Notion veya Slack\'ten gelen gizli zero-width karakterleri temizleyin, bozuk JSON\'ları onarın ve YAML/XML/CSV verilerini milisaniyeler içinde dönüştürün.',

    // Toolbar
    loadSample: 'Örnek Veri',
    sampleScenarios: 'Örnek Senaryolar',
    twoSpaces: '2 Boşluk',
    fourSpaces: '4 Boşluk',
    minify: 'Sıkıştır (Minify)',
    repairJson: 'JSON Onar',
    stripInvisible: 'Gizli Karakterleri Sil',
    unescape: 'Unescape (\\")',
    filters: 'Ayarlar',
    clear: 'Temizle',

    // Filtreler
    optSmartQuotes: 'Akıllı tırnakları düzelt (“ ” → ")',
    optStripAnsi: 'Terminal ANSI renk kodlarını sil',
    optNbsp: 'Bozuk boşlukları düzelt (NBSP)',
    optTrim: 'Satır sonu boşluklarını kırp',
    optComments: 'Yorum satırlarını sil (// /* */)',
    optMask: 'API anahtarlarını & e-postaları maskele',

    // Editör Giriş
    rawInput: 'Ham / Kirli Veri Girişi',
    jsonDetected: 'JSON Algılandı',
    paste: 'Yapıştır',
    inputPlaceholder: 'Kirli metni, bozuk JSON kodunu, terminal loglarını veya veritabanı dizgisini buraya yapıştırın...\n\nÖrnek:\n{\n  user_id: 10492,\n  \'username\': \'alex_dev\',\n  fullName: “Alex Morgan”,\n  isActive: True,\n  permissions: [\'admin\', \'deploy\',],\n}',
    chars: 'karakter',
    lines: 'satır',
    pasteShortcut: 'Ctrl + V ile yapıştır',

    // Editör Çıkış
    cleanedOutput: 'Temizlenmiş Çıktı',
    validJson: 'Geçerli JSON',
    plainText: 'Temiz Metin',
    textFormat: 'Metin Formatı',
    download: 'İndir',
    copy: 'Panoya Kopyala',
    copied: 'Kopyalandı!',
    outputPlaceholder: 'Temizlenen ve formatlanan sonuç burada anlık olarak görünecektir...',
    realtimeSync: 'Yerel ve anlık senkronizasyon',

    // Yapılan İşlemler
    fixesTitle: 'Yapılan düzeltmeler:',
    fixJsonRepaired: 'Bozuk JSON anahtar ve sözdizimi onarıldı',
    fixInvisibleRemoved: 'gizli / zero-width karakter temizlendi',
    fixQuotesNormalized: 'akıllı tırnak standart ASCII yapıldı',
    fixAnsiRemoved: 'terminal ANSI renk kodu silindi',
    fixCommentsRemoved: 'yorum satırı temizlendi',
    fixMasked: 'hassas anahtar / e-posta maskelendi',

    // Format Dönüştürücü
    source: 'Kaynak:',
    target: 'Hedef:',
    swap: 'Kaynak ve Hedefi Değiştir',
    autoDetect: 'Otomatik',
    examples: 'Örnekler:',
    parseError: 'Ayrıştırma / Dönüştürme Hatası',
    parseHint: 'Kaynak verinizin doğru sözdizimine sahip olduğundan emin olun',
    converterInputPlaceholder: 'Dönüştürmek istediğiniz JSON, YAML, XML veya CSV verisini buraya yapıştırın...',
    convertedBadge: 'Dönüştürüldü',

    // Telemetri Paneli
    telemetryTitle: 'Canlı Telemetri & Performans Paneli',
    telemetryLive: 'Canlı',
    telemetryZeroLag: 'Sıfır sunucu gecikmesi',
    metricProcessed: 'İşlenen Veri',
    metricFixes: 'Onarılan Hata',
    metricFixesSub: 'Sözdizimi & gizli karakter',
    metricSizeChange: 'Boyut Optimizasyonu',
    metricSizeSaved: 'tasarruf',
    metricSpeed: 'İşlem Hızı',
    metricZeroNet: 'Yerel bellek',
    metricPrivacy: 'Gizlilik Skoru',
    metricPrivacySub: 'Veri tarayıcıdan asla çıkmaz',

    // Özellikler & Footer
    prop1Title: 'Derleyici Hatalarına Son',
    prop1Desc: 'Slack, Notion veya ChatGPT\'den kopyalanırken araya sızan ve kod derleyicilerini patlatan görünmez zero-width karakterleri temizler.',
    prop2Title: '%100 Tarayıcı İçi Gizlilik',
    prop2Desc: 'Hiçbir sunucuya veri iletilmez. Hassas API anahtarlarınız, müşteri verileriniz ve loglarınız yalnızca sizin cihazınızda kalır.',
    prop3Title: 'Çoklu Format Desteği',
    prop3Desc: 'JSON, YAML, XML ve CSV arasında kayıpsız ve hızlı dönüşüm yaparak format karmaşasını çözer.',
    footerText: 'Bozuk kopyala-yapıştır hatalarını ayıklamaktan bıkmış geliştiriciler için hazırlandı.',
    openSource: 'GitHub',

    // Bağış Modalı
    coffeeTitle: 'Buy Me a Coffee',
    coffeeSubtitle: 'Projeyi reklamsız ve ücretsiz tutmak için destek ol',
    coffeeBody: 'DataPurge tamamen tarayıcınızda çalışan, ücretsiz ve gizlilik odaklı bir araçtır. Eğer bugün size zaman kazandırdıysa bir kahve ısmarlayabilirsiniz!',
    kofiTitle: 'Ko-fi ile Destekle',
    kofiSub: 'Komisyonsuz & uluslararası kart desteği',
    githubSponsorsTitle: 'GitHub Sponsors',
    githubSponsorsSub: 'Geliştirici profilini doğrudan destekle',
    bmacTitle: 'Buy Me a Coffee',
    bmacSub: 'Hızlı ve tek seferlik bağış',
    modalTip: 'Kendi profil linklerinizi SupportModal.tsx içinden güncelleyebilirsiniz',
    copyLink: 'Kopyala',
    linkCopied: 'Kopyalandı',

    // Bildirimler
    toastCopied: 'Panoya kopyalandı!',
    toastCopyFailed: 'Kopyalama başarısız oldu.',
    toastPasted: 'Panodan yapıştırıldı.',
    toastPasteDenied: 'Panoya erişim izni verilmedi.',
    toastCleared: 'Temizlendi.',
    toastDownloaded: 'indirildi.',
    toastSampleLoaded: 'Örnek yüklendi.',
    toastSwapped: 'Kaynak ve hedef format yer değiştirdi.',
  },
};
