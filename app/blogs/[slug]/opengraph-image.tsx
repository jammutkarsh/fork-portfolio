import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../../components/og/og-image';
import { formatDate, getPosts } from '../utils';

export const alt = 'Blog post by Utkarsh Chourasia';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
	return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPosts().find((p) => p.slug === slug);

	if (!post) {
		return renderOgImage({ path: `/blogs/${slug}`, title: 'Blog post' });
	}

	return renderOgImage({
		path: `/blogs/${slug}`,
		title: post.metadata.title,
		description: post.metadata.summary,
		meta: `${formatDate(post.metadata.publishedAt)} · ${post.readingTime}`,
	});
}
