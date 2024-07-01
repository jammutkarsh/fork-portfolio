import siteMetadata from '@/content/siteMetadata';
import ListLayout from '@/layouts/MDX/ListLayout';
import MainLayout from '@/layouts/MainLayout';
import { allCoreContent } from '@/lib/utils/contentlayer';
import kebabCase from '@/lib/utils/kebabCase';
import { allBlogs } from 'contentlayer/generated';

// Function to generate static paths
export async function generateStaticParams() {
  const tags = allBlogs.flatMap((post) => post.tags || []).map((tag) => kebabCase(tag));
  const uniqueTags = Array.from(new Set(tags));

  return uniqueTags.map((tag) => ({
    params: { tag },
  }));
}

// Metadata for the page
export const metadata = {
  title: 'Blog - ' + siteMetadata.title,
  description: 'My Tags - ' + siteMetadata.title,
};

export default function Tag({ params }: { params: { tag: string } }) {
  const { tag } = params;
  const posts = allCoreContent(
    allBlogs.filter(
      (post) => post.draft !== true && post.tags?.map((t) => kebabCase(t)).includes(tag)
    )
  );

  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1);

  return (
    <MainLayout>
      <ListLayout posts={posts} title={title} />
    </MainLayout>
  );
}
