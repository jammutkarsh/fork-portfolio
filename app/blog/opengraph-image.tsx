import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../components/og/og-image';
import { getAllTags, getPosts } from './utils';

export const alt = 'Tech blogs of Utkarsh Chourasia';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
	const posts = getPosts();
	const tags = getAllTags(posts);
	return renderOgImage({
		label: 'Blog',
		title: 'Deep dives, how-tos and notes from the backend',
		description: `${posts.length} articles written so far.`,
		tags: Object.keys(tags).sort((a, b) => tags[b] - tags[a]),
	});
}
