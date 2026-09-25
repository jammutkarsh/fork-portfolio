import Link from 'next/link';
import { kebabCase } from '../blog/kebab-case';

const className =
	'cursor-pointer rounded-md bg-primary-500 px-2 py-0.5 text-xs uppercase text-white motion-safe:transition-colors motion-safe:duration-300 hover:bg-primary-400';

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
