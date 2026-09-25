import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../components/og/og-image';

export const alt = 'Projects by Utkarsh Chourasia';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
	return renderOgImage({
		label: 'Projects',
		title: 'Things I have built',
		description: 'Selected projects worth sharing.',
	});
}
