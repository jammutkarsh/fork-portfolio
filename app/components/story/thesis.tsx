'use client';

import {
	type MotionValue,
	motion,
	useScroll,
	useTransform,
} from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import siteMetadata from '../../site-metadata';

/**
 * The end of the story: the thread that ran down the chapters arrives at
 * the thesis, which reveals itself word by word as it scrolls up, followed
 * by the line that closes the story.
 */
export default function Thesis({
	thesis,
	closing,
}: {
	thesis: string;
	closing: string;
}) {
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress: t } = useScroll({
		target: ref,
		offset: ['start end', 'center center'],
	});
	const line = useTransform(t, [0, 0.35], [0, 1]);
	const closingOpacity = useTransform(t, [0.75, 0.95], [0, 1]);
	const closingY = useTransform(t, [0.75, 0.95], [16, 0]);
	const words = thesis.split(' ');

	return (
		<section
			ref={ref}
			className='relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-24 text-center sm:px-8 md:pb-36'
		>
			<motion.div
				aria-hidden='true'
				style={{ scaleY: line }}
				className='h-24 w-px origin-top bg-linear-to-b from-(--ds-border-strong) to-primary-500 md:h-32'
			/>
			<blockquote className='mt-8 text-3xl leading-tight font-light tracking-[-0.03em] sm:text-4xl lg:text-5xl'>
				<span className='text-primary-500'>“</span>
				{words.map((word, k) => (
					<Word
						// biome-ignore lint/suspicious/noArrayIndexKey: words can repeat
						key={k}
						t={t}
						last={k === words.length - 1}
						from={0.25 + (k / words.length) * 0.5}
						to={0.25 + ((k + 1) / words.length) * 0.5}
					>
						{word}
					</Word>
				))}
				<span className='text-primary-500'>”</span>
			</blockquote>

			<motion.p
				style={{ opacity: closingOpacity, y: closingY }}
				className='mt-8 max-w-2xl text-lg leading-relaxed text-(--ds-text-secondary) sm:text-xl'
			>
				{closing}
			</motion.p>

			<div className='mt-12 flex gap-6 text-base md:text-lg'>
				<Link href='/blogs' className='underline-magical'>
					Blogs &rarr;
				</Link>
				<Link href='/projects' className='underline-magical'>
					Projects &rarr;
				</Link>
				<a
					href={siteMetadata.resume}
					target='_blank'
					rel='noreferrer'
					className='underline-magical'
				>
					Resume ↗
				</a>
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
	from: number;
	to: number;
	last: boolean;
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
