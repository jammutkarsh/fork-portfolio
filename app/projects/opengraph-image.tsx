import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../components/og/og-image';
import { getProjects } from './utils';

export const alt = 'Projects by Utkarsh Chourasia';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
	const count = getProjects().length;
	return renderOgImage({
		path: '/projects',
		title: 'Things I have built',
		description: `${count} ${count === 1 ? 'project' : 'projects'} worth showing`,
	});
}
