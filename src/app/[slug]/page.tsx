import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SanitizerApp } from '@/components/SanitizerApp';
import { SEO_PAGES, getSeoPageBySlug } from '@/lib/seo-pages';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEO_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page Not Found | DataPurge',
    };
  }

  const canonicalUrl = `https://data-sanitizer-pied.vercel.app/${page.slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonicalUrl,
      siteName: 'DataPurge',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
    },
  };
}

export default async function SeoToolPage({ params }: PageProps) {
  const { slug } = await params;
  const seoPage = getSeoPageBySlug(slug);

  if (!seoPage) {
    notFound();
  }

  return <SanitizerApp seoPage={seoPage} />;
}
