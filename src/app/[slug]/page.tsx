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

  const canonicalUrl = `https://data-sanitizer-pied.vercel.app/${seoPage.slug}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: seoPage.metaTitle,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web Browser',
      url: canonicalUrl,
      description: seoPage.metaDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: seoPage.en.whyTitle,
          acceptedAnswer: {
            '@type': 'Answer',
            text: seoPage.en.whyParagraphs.join(' '),
          },
        },
        {
          '@type': 'Question',
          name: seoPage.en.howTitle,
          acceptedAnswer: {
            '@type': 'Answer',
            text: seoPage.en.howParagraphs.join(' '),
          },
        },
        {
          '@type': 'Question',
          name: seoPage.en.privacyTitle,
          acceptedAnswer: {
            '@type': 'Answer',
            text: seoPage.en.privacyParagraphs.join(' '),
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SanitizerApp seoPage={seoPage} />
    </>
  );
}
