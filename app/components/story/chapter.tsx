'use client';

import { type MotionValue, motion, useTransform } from 'motion/react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { PhaseMeta } from './get-story';

// The name on the intro and the chapter titles share one size.
export const heading =
	'text-3xl font-light leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl [@media(max-height:500px)]:text-2xl';

/**
 * One phase of the story: its year, title and prose. It sits on the story's
 * thread (the line down the left) and is in the spotlight while it's in the
 * middle of the screen; `pos` is the reader's position in the story, in
 * phases.
 */
export default function Chapter({
	ref,
	phase,
	index,
	pos,
	children,
}: {
	ref: Ref<HTMLElement>;
	phase: PhaseMeta;
	index: number;
	pos: MotionValue<number>;
	children: ReactNode;
}) {
	const spotlight = useTransform(
		pos,
		[index - 1, index - 0.45, index + 0.45, index + 1],
		[0.3, 1, 1, 0.3],
	);
	const x = useTransform(pos, [index - 1, index - 0.4], [18, 0]);
	const lit = useTransform(pos, [index - 0.6, index - 0.35], [0, 1]);

	return (
		<article
			ref={ref}
			aria-labelledby={`chapter-${phase.id}`}
			style={{ '--world': phase.color } as CSSProperties}
			className='flex flex-col justify-center py-14 pl-7 md:min-h-[calc(92svh-var(--nav))] md:pl-10 [@media(max-height:500px)]:min-h-0'
		>
			<div className='relative'>
				{/* Node on the thread */}
				<span
					aria-hidden='true'
					className='absolute top-1 -left-7 flex size-3.5 -translate-x-1/2 items-center justify-center rounded-full border border-(--ds-border-strong) bg-(--ds-bg-primary) md:-left-10'
				>
					<motion.span
						style={{ scale: lit, opacity: lit }}
						className='size-2 rounded-full bg-(--world) shadow-[0_0_12px_var(--world)]'
					/>
				</span>

				<motion.div style={{ opacity: spotlight, x }}>
					{phase.year && (
						<p className='font-mono text-xs tracking-widest text-[color-mix(in_oklch,var(--world),var(--ds-text-primary)_25%)]'>
							{phase.year}
						</p>
					)}
					<h2 id={`chapter-${phase.id}`} className={`${heading} mt-2`}>
						{phase.title}
					</h2>
					<div className='mt-4 text-base sm:text-lg'>{children}</div>
				</motion.div>
			</div>
		</article>
	);
}
