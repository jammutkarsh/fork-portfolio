import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../components/og/og-image';

export const alt = 'About page of Utkarsh Chourasia’s portfolio website';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
	return renderOgImage({
		label: 'About',
		title: 'Hi, I am Utkarsh',
		description:
			'Software engineer who loves Linux, Go, self-hosting and open source.',
	});
}
