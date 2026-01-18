/**
 * Root Layout
 *
 * App-wide layout with SEO metadata and providers.
 */

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://authentyc.ai'),
  title: 'Authentyc - Match people by who they really are, not who they claim to be',
  description:
    'AI conversation analysis reveals authentic compatibility for hiring, dating, and co-founder matching. See how people really think before you commit.',
  keywords: [
    'AI matching',
    'personality analysis',
    'ChatGPT analysis',
    'hiring',
    'dating',
    'co-founder matching',
    'founder compatibility',
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
        url: 'https://epdjtermjtfijzmhxzoo.supabase.co/storage/v1/object/public/Public/og-image.jpg',
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
    images: ['https://epdjtermjtfijzmhxzoo.supabase.co/storage/v1/object/public/Public/og-image.jpg'],
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Authentyc" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
