import { BlogExplorer } from '../components/blog-explorer';
import Header from '../components/header';
import JsonLd from '../components/json-ld';
import PageContainer from '../components/layouts/page-container';
import { createMetadata } from '../lib/create-metadata';
import siteMetadata from '../site-metadata';
import {
	getAllTags,
	getPosts,
	getTagBadges,
	getTagNames,
	toSummary,
} from './utils';

const description =
	'Notes on backend engineering, Linux, Go and self-hosting — practical write-ups from building and running my own infrastructure.';

export const metadata = createMetadata({
	title: 'Blogs',
	description,
	path: '/blogs',
});

export default function BlogPage() {
	const posts = getPosts();

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `Blogs | ${siteMetadata.title}`,
		description,
		url: `${siteMetadata.siteUrl}/blogs`,
		mainEntity: posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.metadata.title,
			url: `${siteMetadata.siteUrl}/blogs/${post.slug}`,
			datePublished: post.metadata.publishedAt,
		})),
	};

	return (
		<PageContainer>
			<JsonLd data={jsonLd} />
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
