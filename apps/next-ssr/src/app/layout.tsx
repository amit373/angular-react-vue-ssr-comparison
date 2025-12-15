import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { getRequestOrigin } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();

  return {
    title: 'SSR Comparison Suite - Next.js',
    description: 'Production-ready SSR comparison between Next.js, Angular, and Nuxt',
    metadataBase: new URL(origin),
    keywords: ['SSR', 'Server-Side Rendering', 'Next.js', 'Angular', 'Nuxt', 'React', 'Vue', 'Performance', 'SEO'],
    authors: [{ name: 'SSR Comparison Team' }],
    creator: 'SSR Comparison Team',
    publisher: 'SSR Comparison Team',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: origin,
      siteName: 'SSR Comparison Suite',
      title: 'SSR Comparison Suite',
      description: 'Production-ready SSR comparison between Next.js, Angular, and Nuxt',
      images: [
        {
          url: `${origin}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: 'SSR Comparison Suite - Next.js, Angular, Nuxt',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SSR Comparison Suite',
      description: 'Production-ready SSR comparison between Next.js, Angular, and Nuxt',
      images: [`${origin}/og-image.svg`],
      creator: '@ssrcomparison',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-token',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <link rel="preconnect" href="https://jsonplaceholder.typicode.com" />
        <link rel="dns-prefetch" href="https://jsonplaceholder.typicode.com" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <Navigation />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

