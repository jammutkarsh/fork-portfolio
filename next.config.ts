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
			{ source: '/tags', destination: '/blogs', permanent: true },
			{ source: '/tags/:tag', destination: '/blogs?tag=:tag', permanent: true },
			// The blog moved from /blog to /blogs; keep old links (posts, tag
			// filters, Open Graph images) working. Query strings carry over.
			{ source: '/blog', destination: '/blogs', permanent: true },
			{ source: '/blog/:path*', destination: '/blogs/:path*', permanent: true },
		];
	},
};

export default nextConfig;
