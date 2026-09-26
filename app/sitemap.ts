import { getPosts } from './blog/utils';
import siteMetadata from './site-metadata';

export default async function sitemap() {
	const baseUrl = siteMetadata.siteUrl;
	const posts = getPosts();

	const blogs = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: post.metadata.publishedAt,
	}));

	const routes = ['', 'blog', 'projects', 'uses'].map((route) => ({
		url: route === '' ? `${baseUrl}/` : `${baseUrl}/${route}`,
		lastModified: new Date().toISOString().split('T')[0],
	}));

	return [...routes, ...blogs];
}
