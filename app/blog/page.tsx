import type { Metadata } from 'next';
import { BlogExplorer } from '../components/blog-explorer';
import Header from '../components/header';
import PageContainer from '../components/layouts/page-container';
import siteMetadata from '../site-metadata';
import { getAllTags, getPosts, getTagNames, toSummary } from './utils';

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
			<BlogExplorer
				posts={posts.map(toSummary)}
				tags={getAllTags(posts)}
				tagNames={getTagNames(posts)}
			/>
		</PageContainer>
	);
}
