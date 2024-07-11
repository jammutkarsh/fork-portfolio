import { MDXLayoutRenderer } from '@/components/MDXComponents';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import siteMetadata from '@/content/siteMetadata';
import PostLayout from '@/layouts/MDX/PostLayout';
import MainLayout from '@/layouts/MainLayout';
import { coreContent, formatBlogLink, sortedBlogPost } from '@/lib/utils/contentlayer';
import { allBlogs } from 'contentlayer/generated';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const post = allBlogs.find((p) => p.slug === slug);
  const siteURL = `${siteMetadata.siteUrl}/blog/${slug}`;
  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
    creator: siteMetadata.author,
    keywords: post.tags,
    metadataBase: new URL(siteURL),
    openGraph: {
      title: post.title,
      siteName: post.title,
      description: post.summary,
      type: 'article',
      url: new URL(siteURL),
      images: [
        {
          url: '/opengraph-image.png',
          secureUrl: '/opengraph-image.png',
          type: 'image/png',
          alt: `A Blog about ${post.summary} by ${post.author}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const sortedPosts = sortedBlogPost(allBlogs);

  const post = sortedPosts.find((p) => p.slug === slug);
  const author = post?.author || ['default'];

  const postIndex = sortedPosts.findIndex((p) => p.slug === slug);
  const prevContent = sortedPosts[postIndex + 1] || null;
  const prev = prevContent ? coreContent(prevContent) : null;
  const nextContent = sortedPosts[postIndex - 1] || null;
  const next = nextContent ? coreContent(nextContent) : null;

  return (
    <>
      <ScrollProgressBar />
      <MainLayout>
        {post && 'draft' in post && post.draft !== true ? (
          <PostLayout content={post} prev={formatBlogLink(prev)} next={formatBlogLink(next)}>
            <MDXLayoutRenderer toc={post.toc} content={post} authorDetails={author} />
          </PostLayout>
        ) : (
          notFound()
        )}
      </MainLayout>
    </>
  );
}
