'use client';

import classNames from 'classnames';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { kebabCase } from '../blog/kebab-case';
import type { PostSummary } from '../blog/utils';
import { BlogPosts } from './blog-posts';

interface Props {
	posts: PostSummary[];
	tags: Record<string, number>;
	tagNames: Record<string, string>;
}

export function BlogExplorer({ posts, tags, tagNames }: Props) {
	const [query, setQuery] = useState('');
	const [activeTag, setActiveTag] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Press "/" anywhere to jump to the search box.
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (
				event.key === '/' &&
				!['INPUT', 'TEXTAREA'].includes(target.tagName) &&
				!target.isContentEditable
			) {
				event.preventDefault();
				inputRef.current?.focus();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	const sortedTags = useMemo(
		() =>
			Object.keys(tags).sort((a, b) => tags[b] - tags[a] || a.localeCompare(b)),
		[tags],
	);

	const filteredPosts = useMemo(() => {
		const q = query.trim().toLowerCase();
		return posts.filter((post) => {
			const postTags = post.metadata.tags.map(kebabCase);
			if (activeTag && !postTags.includes(activeTag)) {
				return false;
			}
			if (!q) {
				return true;
			}
			const haystack = [
				post.metadata.title,
				post.metadata.summary,
				...post.metadata.tags,
			]
				.join(' ')
				.toLowerCase();
			return q.split(/\s+/).every((word) => haystack.includes(word));
		});
	}, [posts, query, activeTag]);

	return (
		<div className='space-y-6'>
			<div className='relative'>
				<label htmlFor='blog-search' className='sr-only'>
					Search posts
				</label>
				<input
					ref={inputRef}
					id='blog-search'
					type='search'
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder='Search posts…'
					className='w-full rounded-md border border-gray-300 bg-transparent px-4 py-2 pr-10 text-black outline-none placeholder:text-gray-500 focus:border-primary-500 dark:border-gray-700 dark:text-white'
				/>
				<kbd
					hidden={query !== ''}
					className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-300 px-1.5 text-xs text-gray-500 dark:border-gray-700'
				>
					/
				</kbd>
			</div>

			<fieldset className='flex flex-wrap gap-2'>
				<legend className='sr-only'>Filter by tag</legend>
				<TagChip active={activeTag === null} onClick={() => setActiveTag(null)}>
					All ({posts.length})
				</TagChip>
				{sortedTags.map((tag) => (
					<TagChip
						key={tag}
						active={activeTag === tag}
						onClick={() => setActiveTag(activeTag === tag ? null : tag)}
					>
						{tagNames[tag] ?? tag} ({tags[tag]})
					</TagChip>
				))}
			</fieldset>

			{filteredPosts.length > 0 ? (
				<BlogPosts key={`${activeTag}-${query}`} posts={filteredPosts} />
			) : (
				<p className='py-10 text-center text-gray-500 dark:text-gray-400'>
					No posts found.
				</p>
			)}
		</div>
	);
}

function TagChip({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type='button'
			aria-pressed={active}
			onClick={onClick}
			className={classNames(
				'cursor-pointer rounded-md border px-2.5 py-0.5 text-xs uppercase motion-safe:transition-colors motion-safe:duration-200',
				active
					? 'border-primary-500 bg-primary-500 text-white'
					: 'border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-500 dark:border-gray-700 dark:text-gray-400',
			)}
		>
			{children}
		</button>
	);
}
