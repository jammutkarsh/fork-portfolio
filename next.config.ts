import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	pageExtensions: ['ts', 'tsx'],
	transpilePackages: ['next-mdx-remote'],
	reactCompiler: true,
	turbopack: {
		root: path.join(__dirname, '..'),
	},
	experimental: {
		turbopackFileSystemCacheForDev: true,
	},
	async redirects() {
		return [
			// The about page became the story on the home page.
			{ source: '/about', destination: '/', permanent: true },
			// Tag pages were folded into the blog's tag filter.
			{ source: '/tags', destination: '/blog', permanent: true },
			{ source: '/tags/:tag', destination: '/blog?tag=:tag', permanent: true },
		];
	},
};

export default nextConfig;
