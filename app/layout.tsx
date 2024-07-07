import '@/css/prism.css';
import '@/css/tailwind.css';
import '@fontsource/mukta';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LenisProvider from '@/components/Providers/LenisProvider';
import ThemeProvider from '@/components/Providers/ThemeProvider';
import siteMetadata from '@/content/siteMetadata';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.bio,
  creator: siteMetadata.author,
  metadataBase: new URL(siteMetadata.siteUrl),
  openGraph: {
    title: siteMetadata.title,
    siteName: siteMetadata.title,
    description: siteMetadata.bio,
    type: 'website',
    url: new URL(siteMetadata.siteUrl),
    images: [
      {
        url: new URL(`${siteMetadata.siteUrl}/opengraph-image.png`),
        secureUrl: new URL(`${siteMetadata.siteUrl}/opengraph-image.png`),
        type: 'image/png',
        alt: "Home page of Utkarsh Chourasia's portfolio website",
        width: 1200,
        height: 630,
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-white text-black antialiased dark:bg-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <LenisProvider>
            <main>{children}</main>
          </LenisProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
