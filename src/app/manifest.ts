import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DataPurge — Client-Side Data Sanitizer',
    short_name: 'DataPurge',
    description:
      '100% client-side JSON repair, invisible character stripper, API key redactor, and JSON/YAML/XML/CSV converter.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#06b6d4',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
