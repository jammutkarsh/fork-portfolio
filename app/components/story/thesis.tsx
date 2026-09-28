'use client';

import {
	type MotionValue,
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
} from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import type { PhaseMeta } from './get-story';

/**
 * The end of the story: the thread that ran down the chapters arrives at
 * the thesis, which reveals itself word by word as it scrolls up, while the
 * chapters' personas drift in from all over and line up beneath it. Each
 * persona is a button back to its chapter.
 */
export default function Thesis({
	thesis,
	phases,
	onPick,
}: {
	thesis: string;
	phases: PhaseMeta[];
	onPick: (index: number) => void;
}) {
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress: t } = useScroll({
		target: ref,
		offset: ['start end', 'center center'],
	});
	const line = useTransform(t, [0, 0.35], [0, 1]);
	const words = thesis.split(' ');

	return (
		<section
			ref={ref}
			aria-labelledby='thesis'
			className='relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-24 text-center sm:px-8 md:pb-36'
		>
			<motion.div
				aria-hidden='true'
				style={{ scaleY: line }}
				className='h-24 w-px origin-top bg-linear-to-b from-(--ds-border-strong) to-primary-500 md:h-32'
			/>
			<p
				id='thesis'
				className='mt-6 font-mono text-xs tracking-widest text-(--ds-text-secondary) uppercase'
			>
				The thread through every chapter
			</p>
			<blockquote className='mt-5 text-3xl leading-tight font-light tracking-[-0.03em] sm:text-4xl lg:text-5xl'>
				<span className='text-primary-500'>“</span>
				{words.map((word, k) => (
					<Word
						// biome-ignore lint/suspicious/noArrayIndexKey: words can repeat
						key={k}
						last={k === words.length - 1}
						t={t}
						from={0.25 + (k / words.length) * 0.55}
						to={0.25 + ((k + 1) / words.length) * 0.55}
					>
						{word}
					</Word>
				))}
				<span className='text-primary-500'>”</span>
			</blockquote>

			<ul className='mt-10 flex max-w-2xl flex-wrap justify-center gap-2'>
				{phases.map((phase, i) => (
					<Persona
						key={phase.id}
						t={t}
						i={i}
						phase={phase}
						onPick={() => onPick(i)}
					/>
				))}
			</ul>

			<div className='mt-12 flex gap-6 text-base md:text-lg'>
				<Link href='/blogs' className='underline-magical'>
					Blogs &rarr;
				</Link>
				<Link href='/projects' className='underline-magical'>
					Projects &rarr;
				</Link>
			</div>
		</section>
	);
}

function Word({
	t,
	from,
	to,
	last,
	children,
}: {
	t: MotionValue<number>;
	last: boolean;
	from: number;
	to: number;
	children: string;
}) {
	const opacity = useTransform(t, [from, to], [0.15, 1]);
	return (
		<>
			<motion.span style={{ opacity }}>{children}</motion.span>
			{last ? null : ' '}
		</>
	);
}

function Persona({
	t,
	i,
	phase,
	onPick,
}: {
	t: MotionValue<number>;
	i: number;
	phase: PhaseMeta;
	onPick: () => void;
}) {
	const still = useReducedMotion();
	// Scattered start positions, fixed per chip so they don't jump on reload.
	const dx = still ? 0 : Math.sin(i * 2.3 + 1) * 160;
	const dy = still ? 0 : 60 + Math.cos(i * 1.7) * 70;
	const tilt = still ? 0 : Math.sin(i * 3.1) * 14;
	const x = useTransform(t, [0.3, 0.95], [dx, 0]);
	const y = useTransform(t, [0.3, 0.95], [dy, 0]);
	const rotate = useTransform(t, [0.3, 0.95], [tilt, 0]);
	const opacity = useTransform(t, [0.3, 0.7], [0, 1]);

	return (
		<motion.li style={{ x, y, rotate, opacity }}>
			<button
				type='button'
				onClick={onPick}
				className='flex cursor-pointer items-center gap-2 rounded-full border border-(--ds-border-strong) bg-[color-mix(in_oklch,var(--ds-bg-secondary)_80%,transparent)] px-3 py-1.5 text-sm backdrop-blur-sm transition-colors hover:border-primary-500 hover:text-primary-500'
			>
				<span
					aria-hidden='true'
					className='size-2 rounded-full'
					style={{
						backgroundColor: phase.color,
						boxShadow: `0 0 10px ${phase.color}`,
					}}
				/>
				{phase.title}
			</button>
		</motion.li>
	);
}
