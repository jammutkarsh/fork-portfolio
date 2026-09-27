import Link from 'next/link';
import { kebabCase } from '../blog/kebab-case';

// utc-ds badge: a bracket-wrapped [tag] in the accent colour.
const className = 'badge badge-primary cursor-pointer';

/**
 * A post tag. Links to the blog filtered by this tag, or — when `onSelect`
 * is given (on the blog page itself) — filters in place.
 */
export default function Tag({
	text,
	onSelect,
}: {
	text: string;
	onSelect?: (slug: string) => void;
}) {
	const slug = kebabCase(text);

	if (onSelect) {
		return (
			<button
				type='button'
				className={className}
				onClick={() => onSelect(slug)}
			>
				{text}
			</button>
		);
	}

	return (
		<Link href={`/blog?tag=${slug}`} className={className}>
			{text}
		</Link>
	);
}
