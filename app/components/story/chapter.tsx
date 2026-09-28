'use client';

import { type MotionValue, motion, useTransform } from 'motion/react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { PhaseMeta } from './get-story';

// The name on the intro and the chapter titles share one size.
export const heading =
	'text-3xl font-light leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl [@media(max-height:500px)]:text-2xl';

// The phase's colour, toned towards the text colour so it reads in both themes.
const worldText =
	'text-[color-mix(in_oklch,var(--world),var(--ds-text-primary)_25%)]';

/**
 * One phase of the story, told as a persona: who I was, what I was after,
 * what stood in the way, a terminal that types out a moment from it, and
 * how it ties back to the thesis. It sits on the story's thread (the line
 * down the left) and is in the spotlight while it's in the middle of the
 * screen; `pos` is the reader's position in the story, in phases.
 */
export default function Chapter({
	ref,
	phase,
	index,
	total,
	pos,
	children,
}: {
	ref: Ref<HTMLElement>;
	phase: PhaseMeta;
	index: number;
	total: number;
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
	const pad = (n: number) => String(n).padStart(2, '0');

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
					<p className='font-mono text-xs tracking-widest text-(--ds-text-secondary) uppercase'>
						<span className={worldText}>{phase.year ?? 'Now'}</span>
						<span aria-hidden='true'> · </span>
						<span className='sr-only'>, </span>
						Chapter {pad(index + 1)}/{pad(total)}
					</p>
					<h2 id={`chapter-${phase.id}`} className={`${heading} mt-2`}>
						{phase.title}
					</h2>

					<dl className='mt-5 grid gap-2 text-sm sm:grid-cols-2'>
						<Trait label='After'>{phase.drive}</Trait>
						<Trait label='In the way'>{phase.friction}</Trait>
					</dl>

					<div className='mt-4 text-base sm:text-lg'>{children}</div>

					<Scenario
						id={phase.id}
						lines={phase.scenario}
						pos={pos}
						index={index}
					/>

					<p className='mt-5 flex items-baseline gap-2 font-mono text-xs text-(--ds-text-secondary)'>
						<span aria-hidden='true' className={worldText}>
							↳
						</span>
						<span>
							the thread:{' '}
							<span className='text-(--ds-text-primary)'>{phase.thread}</span>
						</span>
					</p>
				</motion.div>
			</div>
		</article>
	);
}

function Trait({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className='rounded-(--ds-radius-lg) border border-(--ds-border) bg-[color-mix(in_oklch,var(--ds-bg-secondary)_70%,transparent)] px-3 py-2 backdrop-blur-sm'>
			<dt className='font-mono text-[0.7rem] tracking-wider text-(--ds-text-tertiary) uppercase'>
				{label}
			</dt>
			<dd className='mt-0.5 text-(--ds-text-primary)'>{children}</dd>
		</div>
	);
}

/**
 * A small terminal whose lines type themselves out as the chapter scrolls
 * into the middle of the screen, and un-type when you scroll back.
 */
function Scenario({
	id,
	lines,
	pos,
	index,
}: {
	id: string;
	lines: string[];
	pos: MotionValue<number>;
	index: number;
}) {
	const offsets = lines.map((_, k) =>
		lines.slice(0, k).reduce((sum, line) => sum + line.length, 0),
	);
	const total = offsets[lines.length - 1] + lines[lines.length - 1].length;
	const typed = useTransform(pos, [index - 0.75, index - 0.05], [0, total]);

	return (
		<div className='terminal mt-5 mb-0 max-w-md'>
			<div className='terminal-header'>
				<span className='terminal-dot' />
				<span className='terminal-dot' />
				<span className='terminal-dot' />
				<span className='terminal-title'>{id}.sh</span>
			</div>
			<div className='terminal-body text-xs sm:text-sm'>
				{lines.map((line, k) => (
					<TypedLine
						key={line}
						text={line}
						offset={offsets[k]}
						typed={typed}
						last={k === lines.length - 1}
					/>
				))}
			</div>
		</div>
	);
}

function TypedLine({
	text,
	offset,
	typed,
	last,
}: {
	text: string;
	offset: number;
	typed: MotionValue<number>;
	last: boolean;
}) {
	const shown = useTransform(typed, (v) =>
		Math.min(text.length, Math.max(0, Math.round(v - offset))),
	);
	// Fully typed lines get their natural width, so a glyph wider than 1ch
	// is never clipped.
	const width = useTransform(shown, (n) =>
		n >= text.length ? 'auto' : `${n}ch`,
	);
	const caret = useTransform(shown, (n) =>
		n > 0 && (n < text.length || last) ? 1 : 0,
	);
	const command = text.startsWith('$ ');

	return (
		<div className='flex min-h-[1.6em] items-center whitespace-pre'>
			<motion.span
				style={{ width }}
				className={`inline-block overflow-hidden ${command ? '' : worldText}`}
			>
				{command ? (
					<>
						<span className='text-(--ds-success)'>$ </span>
						{text.slice(2)}
					</>
				) : (
					text
				)}
			</motion.span>
			<motion.span
				aria-hidden='true'
				style={{ opacity: caret }}
				className='ml-px inline-block h-[1.1em] w-[0.55em] bg-(--ds-text-secondary) motion-safe:animate-pulse'
			/>
		</div>
	);
}
