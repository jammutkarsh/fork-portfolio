'use client';

import { format } from 'date-fns';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import type { PostSummary } from '../blog/utils';
import Tag from './tag';

export function BlogPosts({
	posts,
	onTagSelect,
}: {
	posts: PostSummary[];
	onTagSelect?: (slug: string) => void;
}) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<ul>
			{posts.map((post, index) => (
				<motion.li
					key={post.slug}
					className='group border-b border-dashed border-(--ds-border-strong)'
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
					<Link
						href={`/blog/${post.slug}`}
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
								<Tag key={tag} text={tag} onSelect={onTagSelect} />
							))}
						</div>
					)}
				</motion.li>
			))}
		</ul>
	);
}
