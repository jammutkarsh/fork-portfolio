import Link from 'next/link';
import { kebabCase } from '../blogs/kebab-case';

// utc-ds badge colours (red is left out: it reads as an error).
const variants = [
	'badge-primary',
	'badge-success',
	'badge-info',
	'badge-warning',
	'badge-purple',
];

/**
 * The utc-ds badge class for a tag: a bracket-wrapped [tag] whose colour is
 * picked from its name, so a tag has the same colour everywhere (posts,
 * the blog's filters, project tech stacks).
 */
export function tagBadge(text: string) {
	let hash = 0;
	for (const char of kebabCase(text)) {
		hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
	}
	return `badge ${variants[hash % variants.length]}`;
}

/**
 * A post tag. Links to the blog filtered by this tag, or — when `onSelect`
 * is given (on the blog page itself) — filters in place.
 */
export default function Tag({
	text,
	badge,
	onSelect,
}: {
	text: string;
	/** Badge class (colour); by default picked from the tag's name. */
	badge?: string;
	onSelect?: (slug: string) => void;
}) {
	const slug = kebabCase(text);

	if (onSelect) {
		return (
			<button
				type='button'
				className={`${badge ?? tagBadge(text)} cursor-pointer`}
				onClick={() => onSelect(slug)}
			>
				{text}
			</button>
		);
	}

	return (
		<Link
			href={`/blogs?tag=${slug}`}
			className={`${badge ?? tagBadge(text)} cursor-pointer`}
		>
			{text}
		</Link>
	);
}
