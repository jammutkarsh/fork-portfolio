import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Project } from './types';

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects');

/** Markdown to plain text: drop code ticks, emphasis and link targets. */
function plain(markdown: string) {
	return markdown
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[`*_]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function readProject(file: string): Project {
	const slug = path.basename(file, '.mdx');
	const { data, content } = matter(
		fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8'),
	);

	const missing = [
		!data.name && 'name',
		!data.hero && 'hero',
		!data.repo && 'repo',
		!data.website && !data.install && 'website or install',
		!(Array.isArray(data.stack) && data.stack.length) && 'stack',
		!content.trim() && 'description (the body)',
	].filter(Boolean);
	if (missing.length) {
		throw new Error(
			`content/projects/${file} is missing: ${missing.join(', ')}`,
		);
	}

	return {
		slug,
		name: data.name,
		hero: data.hero,
		repo: data.repo,
		website: data.website,
		install: data.install,
		stack: data.stack,
		description: content.trim(),
		summary: data.summary ?? plain(content.trim().split(/\n\s*\n/)[0]),
		order: data.order,
		demo: data.demo,
		screenshots: data.screenshots,
		architecture: data.architecture,
	};
}

/** All projects, by `order` and then by name. */
export function getProjects(): Project[] {
	if (!fs.existsSync(PROJECTS_DIR)) return [];
	return fs
		.readdirSync(PROJECTS_DIR)
		.filter((file) => file.endsWith('.mdx') && !file.startsWith('_'))
		.map(readProject)
		.sort(
			(a, b) =>
				(a.order ?? Number.POSITIVE_INFINITY) -
					(b.order ?? Number.POSITIVE_INFINITY) || a.name.localeCompare(b.name),
		);
}

export function getProject(slug: string): Project | undefined {
	return getProjects().find((project) => project.slug === slug);
}
