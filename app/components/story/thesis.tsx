'use client';

import {
	type MotionValue,
	motion,
	useScroll,
	useTransform,
} from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import siteMetadata from '../../site-metadata';

/**
 * The end of the story: the thread that ran down the chapters arrives at
 * the thesis, which reveals itself word by word as it scrolls up, followed
 * by the line that closes the story.
 */
export default function Thesis({
	thesis,
	closing,
	thread,
}: {
	thesis: string;
	closing: string;
	/**
	 * The colour of the chapters' thread down the left, when there is one;
	 * it then bends over to the middle and runs into the thesis line.
	 */
	thread?: string;
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
		<>
			{thread && <Connector color={thread} />}
			<section
				ref={ref}
				className='relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-24 text-center sm:px-8 md:pb-36'
			>
				{!thread && (
					<motion.div
						aria-hidden='true'
						style={{ scaleY: line }}
						className='h-24 w-px origin-top bg-linear-to-b from-(--ds-border-strong) to-primary-500 md:h-32'
					/>
				)}
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
					className='mt-8 max-w-2xl text-lg leading-relaxed text-(--ds-text-primary) sm:text-xl'
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
		</>
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

// The connector's shape: down from the thread, round a corner, across to the
// middle, round another corner, and down to the quote.
const DROP = 64;
const RADIUS = 24;
const FALL = 128;

/**
 * Carries the chapters' thread (on the left edge of the column layout) over
 * to the middle of the page and down into the thesis, drawing itself as it
 * scrolls past the middle of the screen, as the thread does.
 */
function Connector({ color }: { color: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start center', 'end 0.6'],
	});

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const measure = () => setWidth(el.clientWidth);
		measure();
		const resize = new ResizeObserver(measure);
		resize.observe(el);
		return () => resize.disconnect();
	}, []);

	const x = width / 2;
	const height = DROP + FALL;
	const r = Math.min(RADIUS, x / 2);
	const d = `M0.5 0V${DROP - r}Q0.5 ${DROP} ${r} ${DROP}H${x - r}Q${x} ${DROP} ${x} ${DROP + r}V${height}`;

	return (
		<div
			aria-hidden='true'
			className='mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-18'
		>
			<div ref={ref} style={{ height }}>
				{width > 0 && (
					<svg
						aria-hidden='true'
						width={width}
						height={height}
						className='block overflow-visible'
						fill='none'
					>
						<defs>
							<linearGradient
								id='thesis-thread'
								gradientUnits='userSpaceOnUse'
								x1={0}
								y1={DROP}
								x2={0}
								y2={height}
							>
								<stop offset='0' stopColor={color} />
								<stop offset='1' stopColor='var(--color-primary-500)' />
							</linearGradient>
						</defs>
						<motion.path
							d={d}
							stroke='url(#thesis-thread)'
							strokeWidth={1}
							style={{ pathLength: scrollYProgress }}
						/>
					</svg>
				)}
			</div>
		</div>
	);
}
