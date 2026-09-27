import type { Metadata } from 'next';
import { BlogExplorer } from '../components/blog-explorer';
import Header from '../components/header';
import PageContainer from '../components/layouts/page-container';
import siteMetadata from '../site-metadata';
import {
	getAllTags,
	getPosts,
	getTagBadges,
	getTagNames,
	toSummary,
} from './utils';

export const metadata: Metadata = {
	title: 'Blogs',
	description: `Blogs | ${siteMetadata.title}`,
	openGraph: {
		title: `Blogs | ${siteMetadata.title}`,
		description: `Blogs | ${siteMetadata.title}`,
		type: 'website',
		url: '/blogs',
	},
};

export default function BlogPage() {
	const posts = getPosts();

	return (
		<PageContainer>
			<Header title='Blogs' />
			<BlogExplorer
				posts={posts.map(toSummary)}
				tags={getAllTags(posts)}
				tagNames={getTagNames(posts)}
				tagBadges={getTagBadges(posts)}
			/>
		</PageContainer>
	);
}
