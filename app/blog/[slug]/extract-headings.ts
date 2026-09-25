import { slug } from 'github-slugger';
import { Children, isValidElement, type ReactNode } from 'react';

export interface Heading {
	id: string;
	text: string;
	level: number;
}

export function slugify(text: string): string {
	return slug(text);
}

/** Flattens rendered heading children (e.g. text + inline code) to plain text. */
export function getTextContent(node: ReactNode): string {
	return Children.toArray(node)
		.map((child) => {
			if (typeof child === 'string' || typeof child === 'number') {
				return String(child);
			}
			if (isValidElement<{ children?: ReactNode }>(child)) {
				return getTextContent(child.props.children);
			}
			return '';
		})
		.join('');
}

export function extractHeadings(content: string): Heading[] {
	const headings: Heading[] = [];
	let inCodeBlock = false;

	for (const line of content.split('\n')) {
		if (/^\s*(```|~~~)/.test(line)) {
			inCodeBlock = !inCodeBlock;
			continue;
		}
		if (inCodeBlock) {
			continue;
		}

		const match = /^(#{2,3})\s+(.+)$/.exec(line);
		if (match) {
			const text = match[2].trim().replace(/`/g, '');
			headings.push({ id: slugify(text), text, level: match[1].length });
		}
	}

	return headings;
}
