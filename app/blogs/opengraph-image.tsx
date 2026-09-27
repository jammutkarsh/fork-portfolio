import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../components/og/og-image';
import { getPosts } from './utils';

export const alt = 'Tech blogs of Utkarsh Chourasia';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
	const count = getPosts().length;
	return renderOgImage({
		path: '/blogs',
		title: 'Deep dives, how-tos and notes from the backend',
		description: `${count} ${count === 1 ? 'article' : 'articles'}`,
	});
}
