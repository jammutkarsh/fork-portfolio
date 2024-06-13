import { MDXLayoutRenderer } from '@/components/MDXComponents';
import AuthorLayout from '@/layouts/MDX/AuthorLayout';
import MainLayout from '@/layouts/MainLayout';
import { allAuthors } from 'contentlayer/generated';
import siteMetadata from 'content/siteMetadata';

export const metadata = {
  title: 'About - ' + siteMetadata.title,
  description: 'About me - ' + siteMetadata.title,
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
