import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../../components/og/og-image';
import { getProject, getProjects } from '../utils';

export const alt = 'A project by Utkarsh Chourasia';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
	return getProjects().map((project) => ({ slug: project.slug }));
}

// Mermaid needs a browser to lay out a diagram, so the architecture is
// rendered by mermaid.ink (the Mermaid project's rendering service), in the
// utc-ds dark palette.
const theme = {
	theme: 'base',
	themeVariables: {
		darkMode: true,
		background: '#111111',
		primaryColor: '#111111',
		primaryTextColor: '#e8e8e8',
		primaryBorderColor: '#333333',
		lineColor: '#ff5f00',
		secondaryColor: '#1a1a1a',
		tertiaryColor: '#1a1a1a',
		fontFamily: 'monospace',
	},
};

async function architecturePng(source: string) {
	const diagram = `%%{init: ${JSON.stringify(theme)}}%%\n${source}`;
	const encoded = Buffer.from(diagram)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
	try {
		const response = await fetch(
			`https://mermaid.ink/img/${encoded}?type=png&bgColor=!111111&width=1800`,
			{ signal: AbortSignal.timeout(15_000) },
		);
		if (
			!response.ok ||
			!response.headers.get('content-type')?.includes('png')
		) {
			return null;
		}
		const png = Buffer.from(await response.arrayBuffer());
		return `data:image/png;base64,${png.toString('base64')}`;
	} catch {
		return null;
	}
}

/** The hero image (any format sharp reads, e.g. WebP) as a PNG data URI. */
async function heroPng(hero: string) {
	const file = await fs.readFile(path.join(process.cwd(), 'public', hero));
	const png = await sharp(file).resize({ width: 1800 }).png().toBuffer();
	return `data:image/png;base64,${png.toString('base64')}`;
}

/**
 * A project's link preview shows its architecture diagram when it has one
 * (and mermaid.ink can render it), and its hero image otherwise.
 */
export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = getProject(slug);
	if (!project) {
		return renderOgImage({ path: `/projects/${slug}`, title: 'Project' });
	}

	const architecture =
		project.architecture && (await architecturePng(project.architecture));
	return renderOgImage({
		path: `/projects/${slug}`,
		title: project.name,
		picture: architecture
			? { src: architecture, fit: 'contain' }
			: { src: await heroPng(project.hero), fit: 'cover' },
	});
}
