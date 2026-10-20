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
  return <SanitizerApp />;
}
