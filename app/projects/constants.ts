import siteMetadata from '../site-metadata';
import type { Project } from './types';

/**
 * Add projects here. `src` is a preview image in `public/static/images/project/`
 * (shown on hover on desktop), `color` is the preview background.
 */
export const projects: Project[] = [
	{
		title: 'Coming soon',
		src: 'placeholder.png',
		color: '#fdd1d9',
		url: siteMetadata.github,
		role: 'Backend Engineer',
	},
];
