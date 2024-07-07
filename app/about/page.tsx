import { MDXLayoutRenderer } from '@/components/MDXComponents';
import siteMetadata from '@/content/siteMetadata';
import AuthorLayout from '@/layouts/MDX/AuthorLayout';
import MainLayout from '@/layouts/MainLayout';
import { allAuthors } from 'contentlayer/generated';
import { Metadata } from 'next';

const siteTitle = 'About - ' + siteMetadata.title;
const siteDescription = 'About me - ' + siteMetadata.title;
const siteURL = `${siteMetadata.siteUrl}/about`;

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  creator: siteMetadata.author,
  metadataBase: new URL(siteURL),
  openGraph: {
    title: siteTitle,
    siteName: siteTitle,
    description: siteDescription,
    type: 'website',
    url: new URL(siteURL),
    images: [
      {
        url: new URL(`${siteURL}/opengraph-image.png`),
        secureUrl: new URL(`${siteURL}/opengraph-image.png`),
        type: 'image/png',
        alt: "About page of Utkarsh Chourasia's portfolio website",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function About() {
  const author = allAuthors.find((p) => p.slug === 'about');

  if (!author) {
    return null;
  }

  return (
    <MainLayout>
      <AuthorLayout content={author}>
        <MDXLayoutRenderer content={author} />
      </AuthorLayout>
    </MainLayout>
  );
}
