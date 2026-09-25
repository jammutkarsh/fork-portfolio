import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../components/og/og-image';

export const alt = 'Tools used by Utkarsh Chourasia';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
	return renderOgImage({
		label: 'Uses',
		title: 'The tools I use to build things',
		description: 'Hardware, software and everything in between.',
	});
}
