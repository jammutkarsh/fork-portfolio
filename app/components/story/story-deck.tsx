'use client';

import classNames from 'classnames';
import { useLenis } from 'lenis/react';
import Snap from 'lenis/snap';
import {
	MotionConfig,
	motion,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from 'motion/react';
import Link from 'next/link';
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { merryWeather } from '../../fonts';
import DeskScene from './desk-scene';
import type { PhaseMeta } from './get-story';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The home page as a slide deck: one frame stays in place while scrolling
 * steps through the slides, the intro first and then each phase of the
 * story. The text swaps in place and the desk beside it changes with the
 * phase; on the intro it shows the desk as it is today, and the first phase
 * rewinds it to the beginning.
 *
 * Leaving the intro, the site's two vertical frame lines slide out past the
 * edges of the screen and the frame widens, giving the story more room.
 */
export default function StoryDeck({
	title,
	bio,
	phases,
	prose,
}: {
	title: string;
	bio: string;
	phases: PhaseMeta[];
	prose: ReactNode[];
}) {
	const slides = phases.length + 1;
	const last = phases.length - 1;
	const container = useRef<HTMLDivElement>(null);
	const frame = useRef<HTMLDivElement>(null);
	const metrics = useRef({ start: 0, step: 1 });
	const [slide, setSlide] = useState(0);
	const lenis = useLenis();
	const { scrollY } = useScroll();

	// Slide i is showing when the page is scrolled to start + i * step.
	const slideAt = useCallback(
		(y: number) => {
			const { start, step } = metrics.current;
			return Math.min(slides - 1, Math.max(0, Math.round((y - start) / step)));
		},
		[slides],
	);

	useMotionValueEvent(scrollY, 'change', (y) => setSlide(slideAt(y)));

	// 0 on the intro, 1 from the first phase on.
	const spread = useTransform(scrollY, (y) => {
		const { start, step } = metrics.current;
		return Math.min(1, Math.max(0, (y - start) / step));
	});
	// How far the lines travel: from the 64rem column's edge to off screen.
	const lineShift = useTransform(spread, (s) =>
		typeof window === 'undefined'
			? 0
			: s * (Math.max(0, (window.innerWidth - 1024) / 2) + 8),
	);
	const leftLine = useTransform(lineShift, (x) => -x);
	const frameWidth = useTransform(
		spread,
		(s) => `calc(64rem + ${s} * (min(100vw, 90rem) - 64rem))`,
	);

	// The lines below stand in for the nav's and footer's side borders
	// (hidden by site.css) so that they can move.
	useEffect(() => {
		document.documentElement.classList.add('story-deck');
		return () => document.documentElement.classList.remove('story-deck');
	}, []);

	// Measure where each slide sits, and settle on the nearest slide once
	// scrolling stops. The end of the page is a snap point too, so the footer
	// stays reachable.
	useEffect(() => {
		let snap: Snap | undefined;
		const setup = () => {
			const el = container.current;
			const pinned = frame.current;
			if (!el || !pinned) return;
			const top = el.getBoundingClientRect().top + window.scrollY;
			const start = top - Number.parseFloat(getComputedStyle(pinned).top);
			const step = (el.offsetHeight - pinned.offsetHeight) / (slides - 1);
			metrics.current = { start, step };
			setSlide(slideAt(window.scrollY));

			snap?.destroy();
			if (!lenis) return;
			snap = new Snap(lenis, { debounce: 150, duration: 0.6 });
			for (let i = 0; i < slides; i++) snap.add(start + i * step);
			snap.add(document.documentElement.scrollHeight - window.innerHeight);
		};
		setup();
		window.addEventListener('resize', setup);
		return () => {
			window.removeEventListener('resize', setup);
			snap?.destroy();
		};
	}, [lenis, slides, slideAt]);

	const goTo = (index: number) => {
		const target = metrics.current.start + index * metrics.current.step;
		if (lenis) lenis.scrollTo(target, { duration: 0.8 });
		else window.scrollTo({ top: target, behavior: 'smooth' });
	};

	const slideMotion = (index: number) => ({
		initial: false as const,
		animate: {
			opacity: index === slide ? 1 : 0,
			y: index === slide ? 0 : index < slide ? -24 : 24,
		},
		transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
	});

	const deskPhase = slide === 0 ? last : slide - 1;
	const next = slide < slides - 1 ? phases[slide].title : null;

	return (
		<MotionConfig reducedMotion='user'>
			<motion.div
				aria-hidden='true'
				className='pointer-events-none fixed inset-y-0 left-[max(0px,calc(50vw-32rem))] z-30 w-px bg-gray-200 dark:bg-gray-300/20'
				style={{ x: leftLine }}
			/>
			<motion.div
				aria-hidden='true'
				className='pointer-events-none fixed inset-y-0 right-[max(0px,calc(50vw-32rem))] z-30 w-px bg-gray-200 dark:bg-gray-300/20'
				style={{ x: lineShift }}
			/>
			<div
				ref={container}
				className='[--nav:3.5rem] sm:[--nav:4rem]'
				style={{ height: `calc(${slides - 1} * 90svh + 100svh - var(--nav))` }}
			>
				<motion.div
					ref={frame}
					style={{ maxWidth: frameWidth }}
					className='sticky top-(--nav) mx-auto flex w-full h-[calc(100svh-var(--nav))] flex-col px-8 pt-6 pb-5 md:px-18 md:pt-10'
				>
					<div className='grid min-h-0 flex-1 grid-rows-[auto_1fr] gap-6 md:grid-cols-[1fr_1.15fr] md:grid-rows-1 md:items-center md:gap-14'>
						<div
							aria-hidden='true'
							className='mx-auto w-full max-w-[calc(32svh*4/3)] md:order-2 md:max-w-none'
						>
							<DeskScene phases={phases} phase={deskPhase} />
						</div>

						<div className='grid min-h-0 md:order-1'>
							<motion.section
								{...slideMotion(0)}
								inert={slide !== 0}
								className='[grid-area:1/1] self-center'
							>
								<h1
									className={classNames(
										'text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl',
										merryWeather.className,
									)}
								>
									{title}
								</h1>
								<p className='mt-5 text-lg text-gray-600 dark:text-gray-400'>
									{bio}
								</p>
							</motion.section>

							{phases.map((phase, i) => {
								const index = i + 1;
								const previous = phases[i - 1];
								return (
									<motion.article
										key={phase.id}
										{...slideMotion(index)}
										aria-hidden='true'
										inert={slide !== index}
										data-lenis-prevent
										className='max-h-full overflow-y-auto [grid-area:1/1] self-center'
									>
										<p className='font-mono text-xs uppercase tracking-widest text-gray-500'>
											Phase {pad(index)} / {pad(phases.length)}
										</p>
										<h2
											className={classNames(
												'mt-2 text-3xl font-bold md:text-4xl',
												merryWeather.className,
											)}
										>
											{phase.title}
										</h2>
										<p className='mt-2 mb-2 font-mono text-sm text-gray-500'>
											{previous && (
												<>
													<s className='decoration-primary-500'>
														{previous.goal}
													</s>
													{' → '}
												</>
											)}
											<span className='text-primary-500'>{phase.goal}</span>
										</p>
										<div className='text-[15px] md:text-base'>{prose[i]}</div>
										{i === last && (
											<div className='mt-4 flex gap-5'>
												<Link href='/blog' className='underline-magical'>
													Read the blog &rarr;
												</Link>
												<Link href='/projects' className='underline-magical'>
													See projects &rarr;
												</Link>
											</div>
										)}
									</motion.article>
								);
							})}
						</div>
					</div>

					<nav
						aria-hidden='true'
						className='mt-4 flex items-center gap-4 font-mono text-xs text-gray-500'
					>
						<span className='tabular-nums'>
							{pad(slide + 1)} / {pad(slides)}
						</span>
						<div className='flex flex-1 gap-1.5'>
							{Array.from({ length: slides }, (_, i) => (
								<button
									// biome-ignore lint/suspicious/noArrayIndexKey: slides are positional
									key={i}
									type='button'
									tabIndex={-1}
									onClick={() => goTo(i)}
									className='group flex h-4 flex-1 cursor-pointer items-center'
								>
									<span
										className={classNames(
											'h-0.5 w-full transition-colors duration-300',
											i <= slide
												? 'bg-primary-500'
												: 'bg-gray-200 group-hover:bg-gray-400 dark:bg-gray-300/20',
										)}
									/>
								</button>
							))}
						</div>
						<button
							type='button'
							tabIndex={-1}
							onClick={() => goTo(slide + 1)}
							className={classNames(
								'hidden cursor-pointer hover:text-gray-900 sm:block dark:hover:text-gray-100',
								!next && 'invisible',
							)}
						>
							{slide === 0 ? 'Scroll to rewind' : `Next: ${next}`} &darr;
						</button>
					</nav>
				</motion.div>
			</div>

			{/* The phases as plain text, for screen readers. */}
			<ol className='sr-only'>
				{phases.map((phase, i) => (
					<li key={phase.id}>
						<h2>{phase.title}</h2>
						<p>Goal: {phase.goal}</p>
						{prose[i]}
					</li>
				))}
				<li>
					<Link href='/blog'>Read the blog</Link>{' '}
					<Link href='/projects'>See projects</Link>
				</li>
			</ol>
		</MotionConfig>
	);
}
