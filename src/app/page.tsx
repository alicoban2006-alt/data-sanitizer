import { SanitizerApp } from '@/components/SanitizerApp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DataPurge — JSON & Text Data Sanitizer for Developers',
  description:
    'Free, instant, client-side utility to clean dirty texts, repair malformed JSONs, strip zero-width spaces, and unescape strings for developers and data analysts.',
  keywords: [
    'json sanitizer',
    'json repair',
    'clean dirty json',
    'strip zero width space',
    'developer utility',
    'micro saas',
    'remove ansi codes',
    'unescape json',
  ],
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DataPurge',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    url: 'https://data-sanitizer-pied.vercel.app',
    description:
      'Free, 100% client-side JSON repair, zero-width character stripper, log redactor, and JSON/YAML/XML/CSV converter with zero telemetry.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Repair broken JSON and Python dicts',
      'Strip zero-width Unicode characters and ANSI codes',
      'Redact API keys, JWTs, emails, and IPs locally',
      'Convert JSON, YAML, XML, and CSV 100% client-side',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SanitizerApp />
    </>
  );
}
