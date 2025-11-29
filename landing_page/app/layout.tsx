/**
 * Root Layout
 *
 * App-wide layout with SEO metadata and providers.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Authentyc - Match people by who they really are, not who they claim to be',
  description:
    'AI conversation analysis reveals authentic compatibility for hiring, dating, and team matching. See how people really think before you commit.',
  keywords: [
    'AI matching',
    'personality analysis',
    'ChatGPT analysis',
    'hiring',
    'dating',
    'team building',
    'authentic compatibility',
  ],
  authors: [{ name: 'Authentyc AI, Inc.' }],
  openGraph: {
    title: 'Authentyc - Authentic Compatibility Matching',
    description:
      'Stop guessing. Start knowing. We analyze AI conversations to reveal real personality, capability, and compatibility.',
    url: 'https://authentyc.ai',
    siteName: 'Authentyc',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Authentyc - Match people by who they really are',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Authentyc - Authentic Compatibility Matching',
    description:
      'Stop guessing. Start knowing. We analyze AI conversations to reveal real personality, capability, and compatibility.',
    images: ['/og-image.png'],
    creator: '@authentyc_ai',
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
