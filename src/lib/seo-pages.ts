import { SanitizerOptions } from './sanitizer';
import { SupportedFormat } from './converter';

export interface LocalizedSeoText {
  heroTitle: string;
  heroSubtitle: string;
  shortLabel: string;
  articleTitle: string;
  intro: string;
  whyTitle: string;
  whyParagraphs: string[];
  howTitle: string;
  howParagraphs: string[];
  privacyTitle: string;
  privacyParagraphs: string[];
}

export interface SeoPageConfig {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  initialTab: 'sanitizer' | 'converter';
  initialFromFormat?: SupportedFormat | 'auto';
  initialToFormat?: SupportedFormat;
  initialOptions?: Partial<SanitizerOptions>;
  sampleInput: string;
  en: LocalizedSeoText;
  tr: LocalizedSeoText;
}

export const SEO_PAGES: SeoPageConfig[] = [
  {
    slug: 'fix-python-dict-to-json',
    metaTitle: 'Convert Python Dict to Valid JSON Online (True/False/None) | DataPurge',
    metaDescription:
      'Instantly convert Python dictionaries with single quotes, True, False, None, and trailing commas into valid JSON 100% client-side in your browser.',
    keywords: [
      'python dict to json',
      'convert python dictionary to json',
      'python true false none to json',
      'single quotes to double quotes json',
      'fix python dict json',
    ],
    initialTab: 'sanitizer',
    initialOptions: { repairJson: true, normalizeQuotes: true },
    sampleInput: `{
  'service': 'auth-gateway',
  'environment': 'production',
  'is_active': True,
  'debug_mode': False,
  'fallback_node': None,
  'allowed_origins': ['https://app.example.com', 'https://api.example.com',],
  'retry_policy': {
    'max_attempts': 3,
    'backoff_enabled': True,
  },
}`,
    en: {
      heroTitle: 'Python Dict to Valid JSON Converter',
      heroSubtitle:
        'Convert Python dictionaries with single quotes, True, False, None, and trailing commas into strict RFC 8259 JSON in milliseconds.',
      shortLabel: 'Python Dict → JSON',
      articleTitle: 'Converting Python Dictionaries to Valid JSON Safely',
      intro:
        'Copying a Python dictionary directly from terminal logs, Jupyter notebooks, or Flask/Django tracebacks into a JSON parser almost always throws a SyntaxError. Although Python dictionaries and JSON objects look nearly identical at a glance, their syntax rules diverge in several critical ways.',
      whyTitle: 'Why does this error occur?',
      whyParagraphs: [
        'When Python prints a dict using str() or repr() instead of json.dumps(), it outputs valid Python syntax rather than valid JSON. First, Python wraps strings and keys in single quotes (\'key\': \'value\'), whereas the JSON specification strictly mandates double quotes ("key": "value").',
        'Second, Python uses capitalized boolean and null keywords—True, False, and None—while JSON requires lowercase true, false, and null. Third, Python developers frequently leave trailing commas after the last element in lists and dictionaries, which standard JSON parsers immediately reject with "Unexpected token }" or "Trailing comma not allowed".',
      ],
      howTitle: 'How is it solved?',
      howParagraphs: [
        'Instead of manually running find-and-replace in your editor—which often breaks apostrophes inside string values or corrupts nested structures—you can paste the raw Python dictionary into DataPurge above. Our deterministic parser normalizes single-quoted keys, string values, and array elements into double-quoted JSON strings.',
        'At the same time, it rewrites standalone Python literals (True → true, False → false, None → null), strips illegal trailing commas before closing braces and brackets, and validates the final structure with native JSON.parse(). You can choose between 2-space formatting, 4-space indentation, or minified output with a single click.',
      ],
      privacyTitle: 'Why should you use 100% Client-Side (Zero-Telemetry)?',
      privacyParagraphs: [
        'Python dictionaries pasted from backend logs, Celery workers, or database dumps frequently contain sensitive internal state: user emails, session IDs, OAuth tokens, or proprietary business metrics. Sending those payloads to a random server-side formatter exposes your infrastructure data to third-party access logs and retention policies.',
        'DataPurge executes every transformation strictly inside your browser’s local JavaScript memory. Zero network requests are dispatched with your payload, zero telemetry is collected, and you can even enable the "Mask API keys & emails" filter to redact secrets before sharing the cleaned JSON with your team.',
      ],
    },
    tr: {
      heroTitle: 'Python Dict → Geçerli JSON Dönüştürücü',
      heroSubtitle:
        'Tek tırnak, True, False, None ve sondaki fazla virgülleri içeren Python sözlüklerini saniyeler içinde geçerli JSON formatına çevirin.',
      shortLabel: 'Python Dict → JSON',
      articleTitle: 'Python Sözlüklerini (Dict) Güvenli Şekilde JSON Formatına Çevirme',
      intro:
        'Terminal loglarından, Jupyter Notebook çıktılarından veya Django/FastAPI hata kayıtlarından kopyalanan bir Python sözlüğünü (dictionary) doğrudan bir JSON aracına yapıştırdığınızda neredeyse her zaman SyntaxError alırsınız. Görünüşte çok benzeseler de Python sözdizimi ile JSON standardı arasında kritik farklar vardır.',
      whyTitle: 'Neden bu hata oluşur?',
      whyParagraphs: [
        'Python, bir sözlüğü json.dumps() yerine standart print() veya repr() ile yazdırdığında JSON değil, geçerli Python kodu üretir. İlk olarak Python anahtarları ve metinleri tek tırnak (\'anahtar\': \'değer\') ile çevreler; ancak JSON standardı (RFC 8259) kesinlikle çift tırnak ("anahtar": "değer") zorunluluğu getirir.',
        'İkinci olarak Python\'da mantıksal değerler ve boş referanslar büyük harfle başlar (True, False, None); JSON ise yalnızca küçük harfli true, false ve null ifadelerini kabul eder. Üçüncü olarak Python listelerinde ve sözlüklerinde son elemandan sonra virgül bırakmak (trailing comma) geçerlidir, fakat standart JSON ayrıştırıcıları bu virgülü gördüğü anda hata verir.',
      ],
      howTitle: 'Nasıl çözülür?',
      howParagraphs: [
        'Kod editöründe tek tek bul-değiştir yapmak hem zaman kaybettirir hem de metin içindeki kesme işaretlerini bozabilir. Yukarıdaki DataPurge aracına ham Python sözlüğünü yapıştırdığınızda onarım motoru anahtarları, değerleri ve dizi elemanlarını otomatik olarak çift tırnağa dönüştürür.',
        'Aynı anda bağımsız True, False ve None ifadelerini true, false ve null olarak günceller, kapanış parantezlerinden önceki fazla virgülleri temizler ve çıktıyı gerçek JSON.parse() motoruyla doğrular. Tek tıkla 2 boşluk, 4 boşluk veya sıkıştırılmış (minify) çıktı alabilirsiniz.',
      ],
      privacyTitle: 'Neden %100 Client-Side (Zero-Telemetry) kullanmalısınız?',
      privacyParagraphs: [
        'Backend loglarından veya veritabanı sorgularından kopyalanan Python sözlükleri çoğu zaman müşteri e-postaları, API anahtarları, dahili ID\'ler ve gizli yapılandırma verileri barındırır. Bu verileri sunucu tabanlı rastgele bir web sitesine göndermek ciddi bir veri sızıntısı riski taşır.',
        'DataPurge tüm onarım işlemlerini tamamen tarayıcınızın yerel belleğinde (client-side) gerçekleştirir. Sunucuya tek bir bayt bile iletilmez; ayrıca araç çubuğundan hassas veri maskeleme seçeneğini açarak token ve e-postaları otomatik gizleyebilirsiniz.',
      ],
    },
  },
  {
    slug: 'remove-zero-width-characters',
    metaTitle: 'Remove Zero-Width Spaces & Invisible Unicode Characters | DataPurge',
    metaDescription:
      'Detect and strip hidden zero-width spaces (\\u200B, \\u200C, \\uFEFF), non-breaking spaces (NBSP), and rogue Unicode characters client-side.',
    keywords: [
      'remove zero width space',
      'strip invisible unicode characters',
      'remove u200b',
      'clean non breaking space nbsp',
      'invisible character remover',
    ],
    initialTab: 'sanitizer',
    initialOptions: { stripInvisibleChars: true, normalizeSpaces: true, repairJson: true },
    sampleInput: `{\u200B
  "project": "DataPurge\u200C",
  "status":\u00A0"active\uFEFF",
  "note": "Copied\u200B from\u200D Notion\u2060 or Slack"
}`,
    en: {
      heroTitle: 'Invisible & Zero-Width Character Remover',
      heroSubtitle:
        'Instantly detect and strip hidden \\u200B, \\u200C, \\uFEFF (BOM), and non-breaking spaces that silently break parsers and compilers.',
      shortLabel: 'Zero-Width Cleaner',
      articleTitle: 'Eliminating Invisible Unicode and Zero-Width Spaces',
      intro:
        'Few debugging sessions are as frustrating as staring at a line of JSON, SQL, or JavaScript that looks 100% syntactically valid—yet fails with an inexplicable "Unexpected token" error. In most cases, the culprit is an invisible Unicode character.',
      whyTitle: 'Why does this error occur?',
      whyParagraphs: [
        'Rich-text editors and collaboration platforms like Notion, Slack, Confluence, Microsoft Teams, and Google Docs inject invisible formatting characters to control line wrapping, text direction, and cursor behavior. Common offenders include Zero-Width Space (U+200B), Zero-Width Non-Joiner (U+200C), Zero-Width Joiner (U+200D), Word Joiner (U+2060), and Byte Order Mark (U+FEFF).',
        'Additionally, copying text from web pages or PDFs frequently introduces Non-Breaking Spaces (U+00A0 / NBSP) instead of standard ASCII spaces (U+0020). Because these characters render with zero width or look identical to normal spaces, your eyes cannot spot them, but strict parsers immediately choke on them.',
      ],
      howTitle: 'How is it solved?',
      howParagraphs: [
        'Paste your suspicious text, configuration file, or failing JSON payload into DataPurge above. With "Strip Hidden Chars" and "Fix non-breaking spaces (NBSP)" enabled, the sanitizer scans every code point in the input.',
        'It strips all zero-width characters, BOM markers, and rogue control characters while converting non-breaking spaces back into standard ASCII spaces. The live Fixes Applied badge shows you the exact count of invisible characters removed so you know immediately whether hidden Unicode caused your bug.',
      ],
      privacyTitle: 'Why should you use 100% Client-Side (Zero-Telemetry)?',
      privacyParagraphs: [
        'When you debug broken production configs, environment variables (.env), or SQL queries copied from internal docs, you cannot afford to paste secrets into an online cleaner that logs requests on a remote backend.',
        'DataPurge runs pure Unicode regex sanitization inside your local browser session. Your text never leaves your device, latency is under 2 milliseconds, and nothing is ever stored or tracked.',
      ],
    },
    tr: {
      heroTitle: 'Görünmez Unicode & Zero-Width Karakter Temizleyici',
      heroSubtitle:
        'Kodunuzu ve JSON ayrıştırıcıları gizlice bozan \\u200B, \\u200C, \\uFEFF (BOM) ve bozuk boşluk (NBSP) karakterlerini anında temizleyin.',
      shortLabel: 'Gizli Karakter Temizle',
      articleTitle: 'Görünmez Unicode ve Zero-Width Boşlukları Temizleme Rehberi',
      intro:
        'Görünüşte hiçbir yazım hatası olmayan bir JSON, SQL veya JavaScript kodunun "Unexpected token" hatası vermesi yazılımcıların en sık karşılaştığı gizemli hatalardan biridir. Çoğu zaman sorunun kaynağı gözle görülmeyen Unicode karakterlerdir.',
      whyTitle: 'Neden bu hata oluşur?',
      whyParagraphs: [
        'Notion, Slack, Confluence, Google Docs veya ChatGPT gibi zengin metin editörleri satır kaydırma ve metin yönünü kontrol etmek için metinlerin arasına görünmez kontrol karakterleri ekler. En yaygın olanları Zero-Width Space (U+200B), Zero-Width Non-Joiner (U+200C), Word Joiner (U+2060) ve Byte Order Mark (U+FEFF) karakterleridir.',
        'Ayrıca web sayfalarından veya PDF\'lerden kopyalanan metinlerde standart boşluk (ASCII 32) yerine Non-Breaking Space (U+00A0 / NBSP) bulunur. Gözle normal boşluktan ayırt edilemeyen bu karakterler JSON.parse(), YAML ayrıştırıcıları ve derleyiciler tarafından geçersiz karakter olarak reddedilir.',
      ],
      howTitle: 'Nasıl çözülür?',
      howParagraphs: [
        'Hata veren metni veya JSON bloğunu yukarıdaki alana yapıştırın. DataPurge üzerindeki görünmez karakter temizleyici ve NBSP normalleştirici tüm Unicode kod noktalarını tarar.',
        'Sıfır genişlikli karakterleri ve BOM işaretlerini tamamen silerken, bozuk NBSP boşluklarını standart boşluğa çevirir. Çıktı panelinin altındaki sayaçta kaç adet gizli karakterin yakalanıp temizlendiğini anlık olarak görebilirsiniz.',
      ],
      privacyTitle: 'Neden %100 Client-Side (Zero-Telemetry) kullanmalısınız?',
      privacyParagraphs: [
        'İç dokümantasyondan veya üretim ortamı yapılandırmalarından kopyalanan metinler genellikle şirket içi API uç noktaları, gizli anahtarlar veya müşteri verileri içerir. Bu verileri sunucuya gönderen bir araca yapıştırmak güvenlik ihlaline yol açabilir.',
        'DataPurge tüm karakter tarama ve temizleme işlemlerini tamamen tarayıcı belleğinde yapar. Hiçbir veri ağ üzerinden dışarı çıkmaz.',
      ],
    },
  },
  {
    slug: 'fix-llm-broken-json',
    metaTitle: 'Fix Broken LLM JSON from ChatGPT, OpenAI & Claude | DataPurge',
    metaDescription:
      'Repair malformed JSON outputs from ChatGPT, OpenAI, and Claude: strip markdown code blocks, trailing commas, comments, and smart quotes locally.',
    keywords: [
      'fix llm broken json',
      'repair chatgpt json output',
      'clean openai json markdown block',
      'claude invalid json fixer',
      'llm json sanitizer',
    ],
    initialTab: 'sanitizer',
    initialOptions: { repairJson: true, removeComments: true, normalizeQuotes: true },
    sampleInput: `\`\`\`json
{
  // Generated by LLM assistant
  "model": "gpt-4o",
  "summary": “Extracted user preferences”,
  is_valid: True,
  "tags": ["automation", "ai",],
}
\`\`\``,
    en: {
      heroTitle: 'LLM Broken JSON Repair (ChatGPT / OpenAI / Claude)',
      heroSubtitle:
        'Strip ```json markdown fences, inline comments, smart quotes, and trailing commas from AI-generated JSON responses instantly.',
      shortLabel: 'Fix LLM JSON',
      articleTitle: 'Repairing Malformed JSON Outputs from Large Language Models',
      intro:
        'Even with structured output modes, Large Language Models (LLMs) like ChatGPT, OpenAI GPT, Claude, and Gemini frequently wrap JSON responses in Markdown fences or slip in JavaScript-style comments and trailing commas.',
      whyTitle: 'Why does this error occur?',
      whyParagraphs: [
        'LLMs are trained on billions of lines of human-written tutorials, GitHub READMEs, and JavaScript configs. As a result, they naturally mimic human habits: wrapping payloads in ```json ... ``` code blocks, adding explanatory // comments inside JSON objects, leaving trailing commas after array items, or mixing in curly typographic quotes (“ ”).',
        'When your application or test script passes that raw LLM completion directly to JSON.parse(), the parser crashes immediately because strict JSON forbids code fences, comments, unquoted keys, and trailing commas.',
      ],
      howTitle: 'How is it solved?',
      howParagraphs: [
        'Paste the raw AI response directly into DataPurge above. The repair engine automatically strips leading and trailing Markdown code fences (```json, ```), removes // single-line and /* */ block comments, converts smart quotes into ASCII double quotes, and repairs unquoted keys or trailing commas.',
        'Within milliseconds, you get strictly valid, formatted JSON ready to drop into Postman, your database seeder, or your frontend mock files.',
      ],
      privacyTitle: 'Why should you use 100% Client-Side (Zero-Telemetry)?',
      privacyParagraphs: [
        'LLM prompts and completions often contain proprietary business logic, customer support transcripts, or internal codebases. Passing AI outputs through a third-party server-side JSON fixer creates an unnecessary second point of data exposure.',
        'DataPurge runs 100% in your browser memory with zero network transmission, keeping your AI workflows private and instantaneous.',
      ],
    },
    tr: {
      heroTitle: 'LLM Bozuk JSON Onarıcı (ChatGPT / OpenAI / Claude)',
      heroSubtitle:
        'Yapay zeka çıktılarındaki ```json markdown bloklarını, yorum satırlarını, akıllı tırnakları ve fazla virgülleri anında onarın.',
      shortLabel: 'LLM JSON Onar',
      articleTitle: 'ChatGPT, OpenAI ve Claude Çıktılarındaki Bozuk JSON\'ları Onarma',
      intro:
        'ChatGPT, Claude veya OpenAI API üzerinden JSON formatında çıktı istediğinizde bile modeller sıklıkla yanıtı Markdown kod blokları içine alır, araya açıklama yorumları ekler veya sözdizimi kurallarını ihlal eder.',
      whyTitle: 'Neden bu hata oluşur?',
      whyParagraphs: [
        'Büyük dil modelleri (LLM) internetteki milyonlarca eğitim yazısı ve JavaScript örneğiyle eğitildiği için JSON üretirken insan alışkanlıklarını taklit eder. Yanıtın başına ve sonuna ```json ... ``` eklemek, obje içine // yorum satırı yazmak, son elemandan sonra virgül bırakmak veya tırnaksız anahtar kullanmak çok sık görülür.',
        'Bu ham çıktıyı doğrudan JSON.parse() fonksiyonuna veya bir API istemcisine verdiğinizde ayrıştırıcı ilk satırdaki ters tırnak (`) veya yorum işaretinde çöker.',
      ],
      howTitle: 'Nasıl çözülür?',
      howParagraphs: [
        'Yapay zekadan aldığınız ham yanıtı yukarıdaki DataPurge editörüne yapıştırın. Onarım motoru baştaki ve sondaki ```json bloklarını otomatik olarak soyar, // ve /* */ yorumlarını temizler, tipografik tırnakları düzeltir ve eksik tırnak/fazla virgül hatalarını onarır.',
        'Saniyeler içinde %100 geçerli ve temizlenmiş JSON çıktısını kopyalayıp projenizde kullanabilirsiniz.',
      ],
      privacyTitle: 'Neden %100 Client-Side (Zero-Telemetry) kullanmalısınız?',
      privacyParagraphs: [
        'LLM yanıtları genellikle şirket içi iş mantığını, analiz edilen müşteri metinlerini veya özel kod parçalarını içerir. Bu çıktıları başka bir sunucuya göndererek temizlemek veri gizliliği açısından risklidir.',
        'DataPurge tamamen tarayıcınızın belleğinde çalışır; verileriniz asla dış sunuculara gönderilmez.',
      ],
    },
  },
  {
    slug: 'json-unescape-online',
    metaTitle: 'JSON Unescape Online — Clean Escaped \\" Strings Client-Side | DataPurge',
    metaDescription:
      'Unescape stringified JSON payloads containing \\", \\n, and \\t escape sequences into readable, formatted JSON 100% locally in your browser.',
    keywords: [
      'json unescape online',
      'unescape json string',
      'remove backslash quotes json',
      'format escaped json logs',
      'double stringified json parser',
    ],
    initialTab: 'sanitizer',
    initialOptions: { unescapeStrings: true, repairJson: true },
    sampleInput: `"{\\"event\\":\\"payment.succeeded\\",\\"amount\\":4900,\\"currency\\":\\"USD\\",\\"metadata\\":{\\"plan\\":\\"pro\\",\\"source\\":\\"web\\"}}"`,
    en: {
      heroTitle: 'JSON Unescape Online (Client-Side)',
      heroSubtitle:
        'Convert escaped \\" strings, \\n newlines, and double-stringified database logs into clean, readable JSON in your browser.',
      shortLabel: 'JSON Unescape',
      articleTitle: 'Unescaping Double-Stringified JSON and Escaped Log Payloads',
      intro:
        'If you have ever pulled a JSON payload out of a PostgreSQL text column, CloudWatch log, or Kafka dead-letter queue, you have probably seen strings packed with backslashes like {\\"id\\":123}. Reading or editing escaped JSON by eye is nearly impossible.',
      whyTitle: 'Why does this error occur?',
      whyParagraphs: [
        'Escaped JSON happens when an already serialized JSON object is serialized a second time as a plain string—often called double-stringification. Logging libraries, webhook queues, and legacy APIs frequently wrap JSON payloads inside string fields, escaping every double quote as \\" and every newline as \\n.',
        'When you paste that string into a standard formatter, it treats the whole block as a single opaque string literal rather than a structured JSON object.',
      ],
      howTitle: 'How is it solved?',
      howParagraphs: [
        'Paste your escaped JSON string into DataPurge above with the Unescape (\\") option enabled. The sanitizer unwraps outer string quotes, decodes \\", \\\\, \\n, and \\t escape sequences, and then parses and pretty-prints the underlying JSON structure.',
        'In one step, a wall of unreadable backslash-heavy log text turns into a cleanly indented, syntax-verified JSON document.',
      ],
      privacyTitle: 'Why should you use 100% Client-Side (Zero-Telemetry)?',
      privacyParagraphs: [
        'Database dumps, webhook logs, and queue payloads are the exact places where customer names, payment metadata, and authentication headers live. Pasting production logs into an ad-supported online unescaper risks exposing sensitive user records.',
        'DataPurge performs all string unescaping and JSON parsing locally inside your browser tab with zero server requests.',
      ],
    },
    tr: {
      heroTitle: 'Çevrimiçi JSON Unescape Aracı (Client-Side)',
      heroSubtitle:
        'Kaçış karakterli (\\", \\n, \\t) ve çift tırnak içine sıkışmış veritabanı/log JSON verilerini okunabilir formata çevirin.',
      shortLabel: 'JSON Unescape',
      articleTitle: 'Kaçış Karakterli (Escaped) JSON Metinlerini Okunabilir Hale Getirme',
      intro:
        'PostgreSQL loglarından, CloudWatch kayıtlarından veya webhook kuyruklarından kopyalanan JSON verileri genellikle {\\"id\\":123} şeklinde ters eğik çizgilerle (backslash) dolu olur. Bu karmaşık metni doğrudan okumak veya düzenlemek neredeyse imkansızdır.',
      whyTitle: 'Neden bu hata oluşur?',
      whyParagraphs: [
        'Bu durum, zaten JSON formatına çevrilmiş bir verinin bir kez daha string olarak serileştirilmesinden (double-stringification) kaynaklanır. Loglama araçları ve bazı API\'ler JSON nesnesini düz metin olarak saklarken içindeki tüm çift tırnakları \\" ve satır sonlarını \\n şeklinde kaçış karakterine dönüştürür.',
        'Standart bir JSON biçimlendiriciye bu metni yapıştırdığınızda araç bunu bir obje olarak değil, tek parça düz bir metin (string) olarak görür ve formatlamaz.',
      ],
      howTitle: 'Nasıl çözülür?',
      howParagraphs: [
        'Üstteki araçta "Unescape (\\")" seçeneği aktifken kaçış karakterli verinizi giriş kutusuna yapıştırın. DataPurge dıştaki gereksiz tırnakları kaldırır, \\" ve \\n kaçış dizilerini çözer ve ortaya çıkan ham JSON yapısını otomatik olarak girintiler.',
        'Tek adımda okunması imkansız log yığınları düzenli ve doğrulanmış JSON belgesine dönüşür.',
      ],
      privacyTitle: 'Neden %100 Client-Side (Zero-Telemetry) kullanmalısınız?',
      privacyParagraphs: [
        'Veritabanı logları ve webhook kayıtları ödeme bilgileri, kullanıcı e-postaları ve oturum belirteçleri gibi en hassas verileri içerir. Bu kayıtları sunucu tabanlı bir siteye göndermek ciddi KVKK/GDPR riskleri doğurur.',
        'DataPurge tüm çözme işlemini tarayıcınızın yerel belleğinde yapar; hiçbir veri sunucuya gönderilmez.',
      ],
    },
  },
  {
    slug: 'remove-comments-from-json',
    metaTitle: 'Remove Comments from JSON (// and /* */) Online | DataPurge',
    metaDescription:
      'Strip single-line // and multi-line /* */ comments from JSONC, tsconfig.json, and config files to produce strict, valid JSON client-side.',
    keywords: [
      'remove comments from json',
      'jsonc to json converter',
      'strip json comments online',
      'clean tsconfig comments',
      'valid json without comments',
    ],
    initialTab: 'sanitizer',
    initialOptions: { removeComments: true, repairJson: true },
    sampleInput: `{
  // Application server settings
  "port": 8080,
  "host": "0.0.0.0",
  /* Enable strict CORS rules
     before deploying to production */
  "cors": {
    "enabled": true,
    "allowCredentials": false
  }
}`,
    en: {
      heroTitle: 'Remove Comments from JSON (JSONC → JSON)',
      heroSubtitle:
        'Strip // single-line and /* */ block comments from tsconfig.json, VS Code settings, and JSONC configs into strict valid JSON.',
      shortLabel: 'Remove JSON Comments',
      articleTitle: 'Stripping Comments from JSONC and Configuration Files',
      intro:
        'Developers love adding comments to configuration files like tsconfig.json, .eslintrc, and VS Code settings.json. However, standard JSON does not support comments—causing deployment scripts, CI pipelines, and API tools to fail when given commented JSON.',
      whyTitle: 'Why does this error occur?',
      whyParagraphs: [
        'Douglas Crockford intentionally omitted comments from the original JSON specification so comments could not be abused as parsing directives. Tools like TypeScript and VS Code use a relaxed superset called JSONC (JSON with Comments), which permits // and /* */ comments.',
        'When you copy a JSONC config into a strict consumer—such as jq, Python’s json module, AWS CloudFormation, or an API body—the parser throws a syntax error the moment it hits a forward slash.',
      ],
      howTitle: 'How is it solved?',
      howParagraphs: [
        'Paste your commented JSON or JSONC file into DataPurge above. With the comment-removal filter enabled, the parser carefully strips // inline comments and /* ... */ multi-line block comments while preserving URLs like "https://..." inside quoted strings.',
        'It then cleans up any leftover trailing commas and validates the final output as strict, production-ready JSON.',
      ],
      privacyTitle: 'Why should you use 100% Client-Side (Zero-Telemetry)?',
      privacyParagraphs: [
        'Configuration files often reveal internal hostnames, port mappings, feature flags, and infrastructure architecture. Keeping those configs inside your browser tab guarantees zero leakage.',
        'DataPurge runs 100% locally in JavaScript memory with zero external network calls.',
      ],
    },
    tr: {
      heroTitle: 'JSON Yorum Satırı Temizleyici (// ve /* */)',
      heroSubtitle:
        'tsconfig.json, VS Code ayarları ve JSONC dosyalarındaki // ve /* */ yorum satırlarını temizleyip geçerli JSON üretin.',
      shortLabel: 'JSON Yorum Temizle',
      articleTitle: 'JSON ve JSONC Dosyalarından Yorum Satırlarını Güvenle Temizleme',
      intro:
        'Geliştiriciler tsconfig.json veya VS Code settings.json gibi yapılandırma dosyalarına açıklama eklemeyi sever. Ancak standart JSON formatı yorum satırlarını desteklemez; bu da CI/CD süreçlerinde veya API araçlarında sözdizimi hatalarına yol açar.',
      whyTitle: 'Neden bu hata oluşur?',
      whyParagraphs: [
        'JSON standardı tasarlanırken ayrıştırıcıların basit kalması için yorum satırları bilinçli olarak kapsam dışı bırakılmıştır. TypeScript ve VS Code gibi araçlar JSONC (Comments destekli JSON) kullanırken, Python, jq veya standart REST API\'ler katı JSON kuralını uygular.',
        'Bu nedenle içinde // veya /* */ bulunan bir dosyayı standart bir JSON ayrıştırıcıya verdiğinizde sistem anında hata verir.',
      ],
      howTitle: 'Nasıl çözülür?',
      howParagraphs: [
        'Yorum satırlı JSON metninizi yukarıdaki editöre yapıştırın. DataPurge üzerindeki yorum temizleme filtresi, tırnak içindeki "https://..." gibi URL\'lere zarar vermeden tüm tek satırlı (//) ve çok satırlı (/* */) yorumları ayıklar.',
        'Ardından kalan fazla virgülleri de temizleyerek %100 geçerli JSON çıktısını hazırlar.',
      ],
      privacyTitle: 'Neden %100 Client-Side (Zero-Telemetry) kullanmalısınız?',
      privacyParagraphs: [
        'Yapılandırma dosyaları iç sunucu adreslerini, portları ve sistem mimarinizi gösterir. Bu dosyaları harici bir sunucuya göndermeden tarayıcı içinde temizlemek en güvenli yoldur.',
        'DataPurge tamamen istemci tarafında çalışır ve hiçbir veriyi dışarı aktarmaz.',
      ],
    },
  },
  {
    slug: 'yaml-to-json-client-side',
    metaTitle: 'Client-Side YAML to JSON Converter (Zero Telemetry) | DataPurge',
    metaDescription:
      'Convert Kubernetes manifests, Docker Compose, and GitHub Actions YAML files into clean JSON 100% client-side without uploading to any server.',
    keywords: [
      'yaml to json client side',
      'convert yaml to json offline',
      'kubernetes yaml to json',
      'docker compose yaml to json',
      'private yaml converter',
    ],
    initialTab: 'converter',
    initialFromFormat: 'yaml',
    initialToFormat: 'json',
    sampleInput: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: datapurge-worker
  labels:
    tier: backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate`,
    en: {
      heroTitle: 'Client-Side YAML to JSON Converter',
      heroSubtitle:
        'Convert Kubernetes manifests, Docker Compose, and CI/CD YAML configs to JSON locally in your browser memory—zero server uploads.',
      shortLabel: 'YAML → JSON',
      articleTitle: 'Converting YAML to JSON Privately in the Browser',
      intro:
        'YAML is the universal language of DevOps—powering Kubernetes, Docker Compose, Helm charts, and GitHub Actions. Yet many APIs, jq scripts, and infrastructure validators require JSON as their input format.',
      whyTitle: 'Why does this conversion matter?',
      whyParagraphs: [
        'While YAML relies on whitespace indentation and supports anchors, comments, and unquoted strings, JSON uses explicit braces and brackets that are much easier for programmatic tools and REST APIs to ingest.',
        'A single misplaced space in YAML can silently change object nesting. Converting YAML to JSON makes the exact parsed data hierarchy immediately visible so you can verify keys, types, and arrays before applying changes to a cluster.',
      ],
      howTitle: 'How is it solved?',
      howParagraphs: [
        'Paste your YAML configuration into the left panel of the Format Converter above. With Source set to YAML (or Auto) and Target set to JSON, DataPurge parses your YAML AST in real time and outputs clean, indented JSON.',
        'If your YAML contains an indentation typo, the converter immediately displays the exact line and reason so you can fix it before deploying.',
      ],
      privacyTitle: 'Why should you use 100% Client-Side (Zero-Telemetry)?',
      privacyParagraphs: [
        'DevOps YAML files routinely contain Kubernetes Secrets, environment variables, database connection strings, and internal VPC hostnames. Uploading infrastructure manifests to a server-based converter is a major security risk.',
        'DataPurge runs the entire YAML-to-JSON conversion inside your browser’s memory. Nothing is transmitted over the network, ensuring complete zero-telemetry privacy.',
      ],
    },
    tr: {
      heroTitle: 'Tarayıcı İçi YAML → JSON Dönüştürücü',
      heroSubtitle:
        'Kubernetes, Docker Compose ve CI/CD YAML dosyalarınızı sunucuya yüklemeden %100 tarayıcı belleğinde JSON formatına çevirin.',
      shortLabel: 'YAML → JSON',
      articleTitle: 'YAML Dosyalarını Sunucuya Göndermeden JSON\'a Dönüştürme',
      intro:
        'YAML; Kubernetes, Docker Compose ve GitHub Actions gibi DevOps araçlarının temel formatıdır. Ancak pek çok REST API, jq komutu ve doğrulama aracı girdi olarak JSON formatını zorunlu kılar.',
      whyTitle: 'Neden bu dönüşüm gerekir?',
      whyParagraphs: [
        'YAML girinti (boşluk) tabanlı bir yapıdır ve tek bir fazladan boşluk bile objenin hiyerarşisini fark ettirmeden bozabilir. JSON ise süslü parantezler kullandığı için veri yapısını netleştirir ve programatik araçlar tarafından çok daha kolay işlenir.',
        'YAML dosyasını JSON\'a çevirmek, yapılandırmanızın küme (cluster) ortamına gönderilmeden önce tam olarak nasıl yorumlandığını görmenizi sağlar.',
      ],
      howTitle: 'Nasıl çözülür?',
      howParagraphs: [
        'YAML içeriğinizi yukarıdaki Format Dönüştürücü panelinin sol tarafına yapıştırın. Kaynak format YAML, hedef format JSON seçiliyken DataPurge girintileri gerçek zamanlı ayrıştırıp düzenli JSON çıktısı üretir.',
        'Eğer YAML içinde bir girinti hatası varsa hatanın satırını anında gösterir.',
      ],
      privacyTitle: 'Neden %100 Client-Side (Zero-Telemetry) kullanmalısınız?',
      privacyParagraphs: [
        'DevOps YAML dosyaları sıklıkla ortam değişkenleri, veritabanı bağlantı adresleri ve gizli anahtarlar içerir. Altyapı yapılandırmalarınızı uzak sunuculu bir siteye yüklemek ciddi güvenlik açığı oluşturur.',
        'DataPurge tüm dönüşümü yerel tarayıcı belleğinizde yapar; tek bir bayt bile dışarı gönderilmez.',
      ],
    },
  },
  {
    slug: 'csv-to-json-privacy',
    metaTitle: 'Private CSV to JSON Converter (100% Client-Side) | DataPurge',
    metaDescription:
      'Convert sensitive CSV spreadsheets containing customer data, financial records, or exports into JSON locally in your browser with zero uploads.',
    keywords: [
      'csv to json privacy',
      'client side csv to json',
      'convert sensitive csv to json offline',
      'secure csv json converter',
      'gdpr safe csv to json',
    ],
    initialTab: 'converter',
    initialFromFormat: 'csv',
    initialToFormat: 'json',
    sampleInput: `id,full_name,role,department,active
101,Ada Lovelace,Principal Engineer,Platform,true
102,Alan Turing,Security Architect,Cryptography,true
103,Grace Hopper,Systems Lead,Compilers,true`,
    en: {
      heroTitle: 'Privacy-First CSV to JSON Converter',
      heroSubtitle:
        'Transform sensitive CSV exports, customer tables, and financial spreadsheets into structured JSON arrays 100% inside your browser.',
      shortLabel: 'CSV → JSON (Private)',
      articleTitle: 'Converting Sensitive CSV Data to JSON Without Uploading',
      intro:
        'Analysts and engineers frequently need to turn exported CSV spreadsheets into JSON arrays for API testing, frontend seeding, or NoSQL imports. However, most online CSV converters upload your file to a remote server to process it.',
      whyTitle: 'Why is this a challenge?',
      whyParagraphs: [
        'CSV is a flat, row-based format without nested objects or explicit data types, whereas modern web applications and APIs expect structured JSON arrays of objects mapped by column headers.',
        'When your CSV contains customer PII (names, emails, phone numbers), payroll sheets, or medical records, uploading that spreadsheet to an unknown backend violates GDPR, HIPAA, and company security policies.',
      ],
      howTitle: 'How is it solved?',
      howParagraphs: [
        'Paste your CSV data into the converter above with Source set to CSV and Target set to JSON. DataPurge reads the header row, maps every subsequent row into a cleanly keyed JSON object, and handles quoted commas automatically.',
        'You get an instant, valid JSON array that you can copy or download as a .json file in seconds.',
      ],
      privacyTitle: 'Why should you use 100% Client-Side (Zero-Telemetry)?',
      privacyParagraphs: [
        'Because DataPurge runs 100% locally in your browser memory, your CSV spreadsheet never touches an external server, database, or analytics tracker.',
        'Even if you disconnect from the internet after loading the page, the CSV-to-JSON conversion continues to work at full speed with zero data exposure.',
      ],
    },
    tr: {
      heroTitle: 'Gizlilik Odaklı CSV → JSON Dönüştürücü',
      heroSubtitle:
        'Müşteri listeleri veya finansal veriler içeren hassas CSV tablolarını hiçbir sunucuya yüklemeden %100 tarayıcı içinde JSON\'a çevirin.',
      shortLabel: 'CSV → JSON (Gizli)',
      articleTitle: 'Hassas CSV Dosyalarını Sunucuya Yüklemeden JSON\'a Dönüştürme',
      intro:
        'Veri analistleri ve geliştiriciler dışa aktarılan CSV tablolarını API testleri veya veritabanı aktarımları için sık sık JSON dizilerine çevirmek ister. Ancak internetteki çoğu dönüştürücü, dosyanızı işlemek için kendi sunucusuna yükler.',
      whyTitle: 'Neden bu sorun yaşanır?',
      whyParagraphs: [
        'CSV düz satır ve sütunlardan oluşan bir formattır; modern web uygulamaları ve NoSQL veritabanları ise sütun başlıklarının anahtar (key) olduğu JSON nesne dizileri bekler.',
        'CSV dosyanızda müşteri adları, e-postalar, telefon numaraları veya maaş kayıtları varsa bu veriyi üçüncü parti bir sunucuya yüklemek KVKK/GDPR ve şirket güvenlik politikalarına aykırıdır.',
      ],
      howTitle: 'Nasıl çözülür?',
      howParagraphs: [
        'CSV verinizi yukarıdaki dönüştürücüye yapıştırın. DataPurge ilk satırdaki başlıkları otomatik olarak okur, tırnak içindeki virgülleri bozmadan her satırı temiz bir JSON objesine dönüştürür.',
        'Çıktıyı anında kopyalayabilir veya .json dosyası olarak bilgisayarınıza indirebilirsiniz.',
      ],
      privacyTitle: 'Neden %100 Client-Side (Zero-Telemetry) kullanmalısınız?',
      privacyParagraphs: [
        'DataPurge tüm ayrıştırma işlemini yalnızca tarayıcınızın belleğinde yürüttüğü için CSV verileriniz ağ üzerinden hiçbir yere gönderilmez.',
        'Sayfa yüklendikten sonra internet bağlantınızı kesseniz bile dönüştürücü aynı hızda ve sıfır telemetri ile çalışmaya devam eder.',
      ],
    },
  },
  {
    slug: 'fix-trailing-commas-json',
    metaTitle: 'Fix Trailing Commas in JSON Objects & Arrays Online | DataPurge',
    metaDescription:
      'Automatically detect and remove illegal trailing commas in JSON arrays and objects client-side without sending data to a server.',
    keywords: [
      'fix trailing commas json',
      'remove trailing comma json online',
      'json unexpected token }',
      'json trailing comma remover',
      'validate and fix json comma',
    ],
    initialTab: 'sanitizer',
    initialOptions: { repairJson: true },
    sampleInput: `{
  "service": "billing-api",
  "regions": [
    "eu-central-1",
    "us-east-1",
  ],
  "features": {
    "webhooks": true,
    "retries": 5,
  },
}`,
    en: {
      heroTitle: 'Fix Trailing Commas in JSON',
      heroSubtitle:
        'Automatically strip illegal trailing commas before closing } and ] brackets in JSON objects and arrays in milliseconds.',
      shortLabel: 'Fix Trailing Commas',
      articleTitle: 'Automatically Removing Illegal Trailing Commas from JSON',
      intro:
        'Trailing commas are completely valid in JavaScript, TypeScript, and Python—which is why developers routinely leave a comma after the last property in an object or array. Unfortunately, strict JSON rejects trailing commas every single time.',
      whyTitle: 'Why does this error occur?',
      whyParagraphs: [
        'Modern code formatters like Prettier encourage trailing commas in JS/TS files because they produce cleaner Git diffs. When a developer copies an object literal from a TypeScript file or hand-edits a JSON payload and deletes the last line without removing the preceding comma, the JSON becomes invalid.',
        'Standard JSON parsers immediately throw errors like "Expected double-quoted property name in JSON" or "Unexpected token ] in JSON" because RFC 8259 strictly forbids trailing commas.',
      ],
      howTitle: 'How is it solved?',
      howParagraphs: [
        'Paste your broken JSON into DataPurge above. The JSON repair engine scans for commas followed by whitespace and a closing brace } or bracket ], as well as accidental duplicate commas like [1, , 2].',
        'It strips every illegal trailing comma cleanly without touching commas inside string values, then validates and pretty-prints the repaired JSON.',
      ],
      privacyTitle: 'Why should you use 100% Client-Side (Zero-Telemetry)?',
      privacyParagraphs: [
        'Even a small typo like a trailing comma often happens in API payloads containing user data, auth headers, or private configuration objects. There is no reason to transmit private payloads to an external server just to remove a comma.',
        'DataPurge repairs your JSON 100% inside your browser’s local memory with zero telemetry and instant execution.',
      ],
    },
    tr: {
      heroTitle: 'JSON Fazla Virgül (Trailing Comma) Düzeltici',
      heroSubtitle:
        'JSON dizilerindeki ve objelerindeki } ve ] öncesi fazla virgülleri tek tıkla otomatik temizleyin ve doğrulayın.',
      shortLabel: 'Fazla Virgül Düzelt',
      articleTitle: 'JSON Objeleri ve Dizilerindeki Fazla Virgülleri Otomatik Temizleme',
      intro:
        'JavaScript, TypeScript ve Python\'da son elemandan sonra virgül (trailing comma) bırakmak tamamen geçerlidir; ancak standart JSON formatı kapanış parantezinden hemen önce gelen virgülleri kesinlikle kabul etmez.',
      whyTitle: 'Neden bu hata oluşur?',
      whyParagraphs: [
        'Prettier gibi modern kod biçimlendiriciler Git farklarını (diff) temiz tutmak için JS/TS dosyalarında son satıra virgül ekler. Geliştiriciler bu kodlardan bir objeyi JSON dosyasına kopyaladığında veya elle düzenleme yapıp son satırı sildiğinde, bir önceki satırda kalan virgül tüm JSON yapısını bozar.',
        'JSON.parse() veya REST istemcileri bu virgülü gördüğü anda "Unexpected token }" veya "Expected double-quoted property name" hatası verir.',
      ],
      howTitle: 'Nasıl çözülür?',
      howParagraphs: [
        'Hata veren JSON verinizi yukarıdaki editöre yapıştırın. Onarım motoru metin içindeki virgüllere dokunmadan, yalnızca } ve ] işaretlerinden hemen önce yer alan tüm geçersiz virgülleri (ve çift virgülleri) tespit edip siler.',
        'Ardından çıktıyı JSON.parse() ile doğrulayarak temiz ve kullanıma hazır hale getirir.',
      ],
      privacyTitle: 'Neden %100 Client-Side (Zero-Telemetry) kullanmalısınız?',
      privacyParagraphs: [
        'Basit bir virgül hatasını düzeltmek için bile API yanıtlarınızı, kullanıcı verilerinizi veya yapılandırma dosyalarınızı sunucu tabanlı bir siteye göndermek gereksiz veri sızıntısı riski taşır.',
        'DataPurge tüm onarım işlemlerini %100 tarayıcınızın yerel belleğinde yapar ve sıfır telemetri ile çalışır.',
      ],
    },
  },
];

export function getSeoPageBySlug(slug: string): SeoPageConfig | undefined {
  return SEO_PAGES.find((page) => page.slug === slug);
}
