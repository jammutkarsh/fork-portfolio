import type { Heading } from './extract-headings';

export interface TOCInlineProps {
	toc: Heading[];
	indentDepth?: number;
	fromHeading?: number;
	toHeading?: number;
	asDisclosure?: boolean;
	exclude?: string | string[];
}

/**
 * Inline table of contents for MDX posts.
 * `exclude` drops headings whose text matches (case-insensitive, full match).
 */
export default function TOCInline({
	toc,
	indentDepth = 3,
	fromHeading = 1,
	toHeading = 6,
	asDisclosure = false,
	exclude = '',
}: TOCInlineProps) {
	const excluded = Array.isArray(exclude) ? exclude.join('|') : exclude;
	const re = new RegExp(`^(${excluded})$`, 'i');

	const filteredToc = toc.filter(
		(heading) =>
			heading.level >= fromHeading &&
			heading.level <= toHeading &&
			!re.test(heading.text),
	);

	const tocList = (
		<ul className='list-disc pl-5 py-2 space-y-1'>
			{filteredToc.map((heading) => (
				<li
					key={heading.id}
					className={heading.level >= indentDepth ? 'ml-6' : undefined}
				>
					<a
						href={`#${heading.id}`}
						className='border-b border-primary-500 text-gray-900 dark:text-gray-100 hover:text-primary-500'
					>
						{heading.text}
					</a>
				</li>
			))}
		</ul>
	);

	if (!asDisclosure) {
		return tocList;
	}

	return (
		<details open>
			<summary className='pt-2 pb-2 text-xl font-bold'>
				Table of Contents
			</summary>
			{tocList}
		</details>
	);
}
