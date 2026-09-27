import { getPosts } from './blogs/utils';
import { getProjects } from './projects/utils';
import siteMetadata from './site-metadata';

export default async function sitemap() {
	const baseUrl = siteMetadata.siteUrl;
	const posts = getPosts();

	const blogs = posts.map((post) => ({
		url: `${baseUrl}/blogs/${post.slug}`,
		lastModified: post.metadata.publishedAt,
	}));

	const projects = getProjects().map((project) => ({
		url: `${baseUrl}/projects/${project.slug}`,
		lastModified: new Date().toISOString().split('T')[0],
	}));

	const routes = ['', 'blogs', 'projects', 'uses'].map((route) => ({
		url: route === '' ? `${baseUrl}/` : `${baseUrl}/${route}`,
		lastModified: new Date().toISOString().split('T')[0],
	}));

	return [...routes, ...blogs, ...projects];
}
