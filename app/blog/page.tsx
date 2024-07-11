import siteMetadata from '@/content/siteMetadata';
import ListLayout from '@/layouts/MDX/ListLayout';
import MainLayout from '@/layouts/MainLayout';
import { sortedBlogPost } from '@/lib/utils/contentlayer';
import { POSTS_PER_PAGE } from '@/types/default';
import { allBlogs } from 'contentlayer/generated';
import { Metadata } from 'next';

const siteTitle = 'Blog - ' + siteMetadata.title;
const siteDescription = 'Blogs - ' + siteMetadata.title;
const siteURL = `${siteMetadata.siteUrl}/blog`;

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
        url: new URL(`${siteURL}/opengraph-image`),
        secureUrl: new URL(`${siteURL}/opengraph-image`),
        type: 'image/png',
        alt: "Blog page of Utkarsh Chourasia's portfolio website",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Blog() {
  const activePosts = allBlogs.filter((p) => p.draft === false);
  const posts = sortedBlogPost(activePosts);
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return (
    <MainLayout>
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="Blog"
      />
    </MainLayout>
  );
}
