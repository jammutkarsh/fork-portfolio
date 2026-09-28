'use client';

import classNames from 'classnames';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { kebabCase } from '../blogs/kebab-case';
import type { PostSummary } from '../blogs/utils';
import { BlogPosts } from './blog-posts';
import { tagBadge } from './tag';

interface Props {
	posts: PostSummary[];
	tags: Record<string, number>;
	tagNames: Record<string, string>;
	/** Each tag's badge class (colour), from getTagBadges. */
	tagBadges: Record<string, string>;
}

export function BlogExplorer({ posts, tags, tagNames, tagBadges }: Props) {
	const [query, setQuery] = useState('');
	const [activeTag, setActiveTag] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Start from `?tag=` (links from post pages) and keep the URL in sync.
	useEffect(() => {
		const tag = new URLSearchParams(window.location.search).get('tag');
		if (tag && tags[tag]) {
			setActiveTag(tag);
		}
	}, [tags]);

	const selectTag = (tag: string | null) => {
		setActiveTag(tag);
		const url = new URL(window.location.href);
		if (tag) {
			url.searchParams.set('tag', tag);
		} else {
			url.searchParams.delete('tag');
		}
		window.history.replaceState(null, '', url);
	};

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
					className='w-full rounded-(--ds-radius) border border-(--ds-border-strong) bg-(--ds-bg-secondary) px-4 py-2 pr-10 font-mono text-sm text-(--ds-text-primary) outline-none placeholder:text-(--ds-text-tertiary) focus:border-primary-500'
				/>
				<kbd
					hidden={query !== ''}
					className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-(--ds-radius-sm) border border-(--ds-border-strong) px-1.5 font-mono text-xs text-(--ds-text-tertiary)'
				>
					/
				</kbd>
			</div>

			<fieldset className='flex flex-wrap gap-x-3 gap-y-2'>
				<legend className='sr-only'>Filter by tag</legend>
				<TagChip
					active={activeTag === null}
					badge='badge badge-primary'
					onClick={() => selectTag(null)}
				>
					all ({posts.length})
				</TagChip>
				{sortedTags.map((tag) => (
					<TagChip
						key={tag}
						active={activeTag === tag}
						badge={tagBadges[tag] ?? tagBadge(tag)}
						onClick={() => selectTag(activeTag === tag ? null : tag)}
					>
						{(tagNames[tag] ?? tag).toLowerCase()} ({tags[tag]})
					</TagChip>
				))}
			</fieldset>

			{filteredPosts.length > 0 ? (
				<BlogPosts
					key={`${activeTag}-${query}`}
					posts={filteredPosts}
					onTagSelect={selectTag}
					tagBadges={tagBadges}
				/>
			) : (
				<p className='py-10 text-center font-mono text-sm text-(--ds-text-secondary)'>
					No posts found.
				</p>
			)}
		</div>
	);
}

function TagChip({
	active,
	badge,
	onClick,
	children,
}: {
	active: boolean;
	/** The tag's badge class (its colour), see tagBadge. */
	badge: string;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type='button'
			aria-pressed={active}
			onClick={onClick}
			className={classNames(
				// utc-ds badge look: a bracket-wrapped [tag (n)] in the tag's colour;
				// the selected one is tinted, the rest dimmed until hovered
				badge,
				'cursor-pointer',
				active
					? 'bg-[color-mix(in_oklch,currentColor_15%,transparent)]'
					: 'opacity-60 hover:opacity-100',
			)}
		>
			{children}
		</button>
	);
}
