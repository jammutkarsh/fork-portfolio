import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { SketchId } from './sketches';

export interface PhaseMeta {
	id: string;
	title: string;
	goal: string;
	/** Framed on the wall of the desk; see sketches.tsx for the options. */
	sketch: SketchId;
}

export interface Phase extends PhaseMeta {
	/** Markdown source of the phase's section in content/story.mdx. */
	body: string;
}

export interface Story {
	name: string;
	avatar: string;
	occupation: string;
	phases: Phase[];
}

/**
 * Reads content/story.mdx. Phase metadata lives in the frontmatter; each
 * phase's prose is the `## <title>` section of the body with the same title.
 */
export function getStory(): Story {
	const { data, content } = matter(
		fs.readFileSync(path.join(process.cwd(), 'content/story.mdx'), 'utf-8'),
	);

	const sections = new Map<string, string>();
	for (const chunk of content.split(/^## /m).slice(1)) {
		const newline = chunk.indexOf('\n');
		sections.set(chunk.slice(0, newline).trim(), chunk.slice(newline).trim());
	}

	const phases = (data.phases as PhaseMeta[]).map((phase) => {
		const body = sections.get(phase.title);
		if (body === undefined) {
			throw new Error(
				`content/story.mdx: no "## ${phase.title}" section for phase "${phase.id}"`,
			);
		}
		return { ...phase, body };
	});

	return {
		name: data.name,
		avatar: data.avatar,
		occupation: data.occupation,
		phases,
	};
}
