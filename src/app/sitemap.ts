import { MetadataRoute } from 'next';
import { SEO_PAGES } from '@/lib/seo-pages';

const BASE_URL = 'https://data-sanitizer-pied.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const seoRoutes: MetadataRoute.Sitemap = SEO_PAGES.map((page) => ({
    url: `${BASE_URL}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...seoRoutes,
  ];
}
