import { getAllTags, getPosts } from './blog/utils';
import siteMetadata from './site-metadata';

export default async function sitemap() {
	const baseUrl = siteMetadata.siteUrl;
	const posts = getPosts();

	const blogs = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: post.metadata.publishedAt,
	}));

	const tags = Object.keys(getAllTags(posts)).map((tag) => ({
		url: `${baseUrl}/tags/${tag}`,
		lastModified: new Date().toISOString().split('T')[0],
	}));

	const routes = ['', 'blog', 'projects', 'about', 'uses', 'tags'].map(
		(route) => ({
			url: route === '' ? `${baseUrl}/` : `${baseUrl}/${route}`,
			lastModified: new Date().toISOString().split('T')[0],
		}),
	);

	return [...routes, ...blogs, ...tags];
}
