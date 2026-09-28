'use client';

import { format } from 'date-fns';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import type { PointerEvent } from 'react';
import { kebabCase } from '../blogs/kebab-case';
import type { PostSummary } from '../blogs/utils';
import Tag from './tag';

// Keep the hover halo centred on the pointer.
function followPointer(event: PointerEvent<HTMLElement>) {
	const box = event.currentTarget.getBoundingClientRect();
	event.currentTarget.style.setProperty(
		'--halo-x',
		`${event.clientX - box.left}px`,
	);
	event.currentTarget.style.setProperty(
		'--halo-y',
		`${event.clientY - box.top}px`,
	);
}

export function BlogPosts({
	posts,
	onTagSelect,
	tagBadges = {},
}: {
	posts: PostSummary[];
	onTagSelect?: (slug: string) => void;
	/** Each tag's badge class (colour), from getTagBadges. */
	tagBadges?: Record<string, string>;
}) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<ul>
			{posts.map((post, index) => (
				<motion.li
					key={post.slug}
					onPointerMove={followPointer}
					className='group relative isolate border-b border-dashed border-(--ds-border-strong)'
					initial={{
						scale: prefersReducedMotion ? 1 : 0.8,
						opacity: 0,
						filter: prefersReducedMotion ? 'blur(0px)' : 'blur(2px)',
					}}
					animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
					transition={{
						duration: prefersReducedMotion ? 0.2 : 0.6,
						delay: prefersReducedMotion ? 0 : index / 10,
					}}
				>
					{/* Halo: a soft glow that follows the pointer while hovering */}
					<span
						aria-hidden='true'
						className='pointer-events-none absolute -inset-x-4 inset-y-0 -z-10 rounded-(--ds-radius-lg) bg-[radial-gradient(320px_circle_at_var(--halo-x,50%)_var(--halo-y,50%),color-mix(in_oklch,var(--ds-primary)_16%,transparent),transparent_70%)] opacity-0 motion-safe:transition-opacity motion-safe:duration-300 [@media(hover:hover)]:group-hover:opacity-100'
					/>
					<Link
						href={`/blogs/${post.slug}`}
						aria-label={`Read "${post.metadata.title}"`}
					>
						<article className='space-y-2 py-5'>
							<div className='flex w-full items-center justify-between'>
								<h2 className='w-full max-w-2xl truncate whitespace-nowrap pr-2 text-base font-medium text-(--ds-text-primary) transition-colors duration-150 group-hover:text-primary-500 md:w-auto md:flex-none md:text-xl'>
									{post.metadata.title}
								</h2>
								<div className='mx-1 flex flex-1 border-b border-dotted border-(--ds-border-strong)' />
								<time className='w-max whitespace-nowrap pl-2 font-mono text-xs text-(--ds-text-secondary)'>
									{format(new Date(post.metadata.publishedAt), 'MMMM dd, yyyy')}
								</time>
							</div>
							<p className='text-sm text-(--ds-text-secondary)'>
								{post.metadata.summary}
							</p>
						</article>
					</Link>
					{post.metadata.tags.length > 0 && (
						<div className='flex flex-wrap gap-2 pb-5 -mt-2'>
							{post.metadata.tags.map((tag) => (
								<Tag
									key={tag}
									text={tag}
									badge={tagBadges[kebabCase(tag)]}
									onSelect={onTagSelect}
								/>
							))}
						</div>
					)}
				</motion.li>
			))}
		</ul>
	);
}
