import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import { cache } from 'react';
import readingTime from 'reading-time';
import rehypePrettyCode from 'rehype-pretty-code';
import { components } from '../components/mdx';
import { extractHeadings } from './[slug]/extract-headings';
import TOCInline, { type TOCInlineProps } from './[slug]/toc-inline';
import { kebabCase } from './kebab-case';

export const POSTS_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
	metadata: Metadata;
	slug: string;
	content: string;
	readingTime: string;
}

/** A post without its MDX body — safe to pass to client components. */
export type PostSummary = Omit<BlogPost, 'content'>;

export function toSummary({
	content: _content,
	...summary
}: BlogPost): PostSummary {
	return summary;
}

type Metadata = {
	title: string;
	publishedAt: string;
	summary: string;
	draft: boolean;
	tags: string[];
	author?: string;
	image?: string;
};

function normalizeDraft(value: unknown): boolean {
	if (typeof value === 'boolean') {
		return value;
	}
	if (typeof value === 'string') {
		return value.toLowerCase() === 'true';
	}
	return false;
}

function matterDataToMetadata(data: Record<string, unknown>): Metadata {
	const image = data.image;
	return {
		title: String(data.title ?? ''),
		publishedAt: String(data.publishedAt ?? data.date ?? ''),
		summary: String(data.summary ?? ''),
		draft: normalizeDraft(data.draft),
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		...(typeof data.author === 'string' ? { author: data.author } : {}),
		...(typeof image === 'string' && image.length > 0 ? { image } : {}),
	};
}

/** Single source of truth for frontmatter: same parser for listings and full posts. */
function parseMdxSource(raw: string) {
	const { data, content } = matter(raw);
	return {
		metadata: matterDataToMetadata(data as Record<string, unknown>),
		content: content.trim(),
	};
}

function getMDXFiles(dir: string) {
	return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

export function readMDXFile(filePath: string) {
	const rawContent = fs.readFileSync(filePath, 'utf-8');
	return parseMdxSource(rawContent);
}

function getMDXData(dir: string): BlogPost[] {
	const mdxFiles = getMDXFiles(dir);
	return mdxFiles.map((file) => {
		const { metadata, content } = readMDXFile(path.join(dir, file));
		const slug = path.basename(file, path.extname(file));

		return {
			metadata,
			slug,
			content,
			readingTime: readingTime(content).text,
		};
	});
}

export function getPosts(): BlogPost[] {
	const posts = getMDXData(POSTS_DIR);

	return posts
		.filter((post) => !post.metadata.draft)
		.sort((a, b) => {
			return (
				new Date(b.metadata.publishedAt).getTime() -
				new Date(a.metadata.publishedAt).getTime()
			);
		});
}

export function formatDate(date: string, includeRelative = false) {
	const currentDate = new Date();
	if (!date.includes('T')) {
		date = `${date}T00:00:00`;
	}
	const targetDate = new Date(date);

	const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
	const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
	const daysAgo = currentDate.getDate() - targetDate.getDate();

	let formattedDate = '';

	if (yearsAgo > 0) {
		formattedDate = `${yearsAgo}y ago`;
	} else if (monthsAgo > 0) {
		formattedDate = `${monthsAgo}mo ago`;
	} else if (daysAgo > 0) {
		formattedDate = `${daysAgo}d ago`;
	} else {
		formattedDate = 'Today';
	}

	const fullDate = targetDate.toLocaleString('en-us', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});

	if (!includeRelative) {
		return fullDate;
	}

	return `${fullDate} (${formattedDate})`;
}

export const getPostFromSlug = cache(async (slug: string) => {
	const raw = await fs.promises.readFile(
		path.join(POSTS_DIR, `${slug}.mdx`),
		'utf-8',
	);

	const { metadata, content: mdxBody } = parseMdxSource(raw);
	const toc = extractHeadings(mdxBody);

	const { content } = await compileMDX({
		source: mdxBody,
		options: {
			parseFrontmatter: false,
			// Posts are first-party content; allow JSX expression props like toHeading={2}.
			blockJS: false,
			mdxOptions: {
				remarkPlugins: [],
				rehypePlugins: [
					[
						rehypePrettyCode,
						{
							theme: 'dracula',
						},
					],
				],
				format: 'mdx',
			},
		},
		components: {
			...components,
			TOCInline: (props: Omit<TOCInlineProps, 'toc'>) =>
				TOCInline({ ...props, toc }),
		},
	});

	return {
		metadata,
		content,
		readingTime: readingTime(mdxBody).text,
	};
});

/** Maps each tag slug to its display name as written in frontmatter. */
export function getTagNames(posts: PostSummary[]): Record<string, string> {
	const names: Record<string, string> = {};
	for (const post of posts) {
		for (const tag of post.metadata.tags) {
			names[kebabCase(tag)] ??= tag;
		}
	}
	return names;
}

export function getAllTags(posts: PostSummary[]): Record<string, number> {
	const tags: Record<string, number> = {};
	for (const post of posts) {
		for (const tag of post.metadata.tags) {
			const key = kebabCase(tag);
			tags[key] = (tags[key] ?? 0) + 1;
		}
	}
	return tags;
}
