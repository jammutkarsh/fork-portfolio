import { getAllTags, getPosts } from '../blog/utils';
import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../components/og/og-image';

export const alt = 'Blog tags of Utkarsh Chourasia';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
	const tags = getAllTags(getPosts());
	const topTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
	return renderOgImage({
		label: 'Tags',
		title: 'Browse posts by topic',
		description: `${topTags.length} topics across the blog.`,
		tags: topTags,
	});
}
