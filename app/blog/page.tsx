import type { Metadata } from 'next';
import { BlogPosts } from '../components/blog-posts';
import Header from '../components/header';
import PageContainer from '../components/layouts/page-container';
import siteMetadata from '../site-metadata';
import { getPosts } from './utils';

export const metadata: Metadata = {
	title: 'Blog',
	description: `Blog | ${siteMetadata.title}`,
	openGraph: {
		title: `Blog | ${siteMetadata.title}`,
		description: `Blog | ${siteMetadata.title}`,
		type: 'website',
		url: '/blog',
	},
};

export default function BlogPage() {
	const posts = getPosts();

	return (
		<PageContainer>
			<Header title='Blog' />
			<BlogPosts posts={posts} />
		</PageContainer>
	);
}
