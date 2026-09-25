import { ogContentType, ogSize, renderOgImage } from './components/og/og-image';

export const alt = 'Home page of Utkarsh Chourasia’s portfolio website';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
	return renderOgImage({
		label: 'Portfolio',
		title: 'Utkarsh Chourasia',
		description:
			'Server Side Engineer. I build stuff in the backend and write about Linux, Go, self-hosting and open source.',
	});
}
