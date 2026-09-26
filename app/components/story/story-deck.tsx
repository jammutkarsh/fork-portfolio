'use client';

import classNames from 'classnames';
import { useLenis } from 'lenis/react';
import Snap from 'lenis/snap';
import {
	AnimatePresence,
	MotionConfig,
	motion,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { merryWeather } from '../../fonts';
import FrameLines from '../layouts/frame-lines';
import DeskScene from './desk-scene';
import type { PhaseMeta } from './get-story';

const ease = [0.22, 1, 0.36, 1] as const;

// The phase title rolls like a drum: in from below going forward, from
// above going back.
const drum = {
	enter: (dir: number) => ({
		y: `${dir * 100}%`,
		rotateX: dir * -70,
		opacity: 0,
	}),
	center: { y: '0%', rotateX: 0, opacity: 1 },
	exit: (dir: number) => ({
		y: `${dir * -100}%`,
		rotateX: dir * 70,
		opacity: 0,
	}),
};

/**
 * The home page as a slide deck: one frame stays in place while scrolling
 * steps through the slides, the intro first and then each phase of the
 * story.
 *
 * Leaving the intro (driven by the scroll position, so it plays both ways)
 * the photo gives way to the desk, the site's two vertical frame lines slide
 * off screen and the frame widens. On the phases, the paragraph swaps in
 * place, the title rolls over in the top-left, the desk changes with the
 * phase and the goals line along the bottom grows by one.
 */
export default function StoryDeck({
	title,
	bio,
	avatar,
	phases,
	prose,
}: {
	title: string;
	bio: string;
	avatar: string;
	phases: PhaseMeta[];
	prose: ReactNode[];
}) {
	const slides = phases.length + 1;
	const container = useRef<HTMLDivElement>(null);
	const frame = useRef<HTMLDivElement>(null);
	const metrics = useRef({ start: 0, step: 1 });
	const [{ slide, dir }, setPosition] = useState({ slide: 0, dir: 1 });
	// The story's text only shows once the frame has fully opened, so the
	// paragraph never re-wraps while the frame is still widening.
	const [opened, setOpened] = useState(false);
	const [footerHeight, setFooterHeight] = useState(0);
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

	const setSlide = useCallback((next: number) => {
		setPosition((prev) =>
			prev.slide === next
				? prev
				: { slide: next, dir: next > prev.slide ? 1 : -1 },
		);
	}, []);

	useMotionValueEvent(scrollY, 'change', (y) => setSlide(slideAt(y)));

	// 0 on the intro, 1 from the first phase on.
	const spread = useTransform(scrollY, (y) => {
		const { start, step } = metrics.current;
		return Math.min(1, Math.max(0, (y - start) / step));
	});
	useMotionValueEvent(spread, 'change', (s) => setOpened(s > 0.98));
	const frameWidth = useTransform(
		spread,
		(s) => `calc(64rem + ${s} * (min(100vw, 90rem) - 64rem))`,
	);
	const introOpacity = useTransform(spread, [0, 0.5], [1, 0]);
	const introY = useTransform(spread, [0, 0.5], [0, -30]);
	const photoOpacity = useTransform(spread, [0.15, 0.7], [1, 0]);
	const photoScale = useTransform(spread, [0, 0.7], [1, 0.85]);
	const photoBlur = useTransform(spread, [0, 0.7], ['blur(0px)', 'blur(8px)']);
	const deskReveal = useTransform(
		spread,
		[0.2, 1],
		['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'],
	);

	// On the home page the site footer is pinned to the bottom of the screen
	// and fades in on the last slide (see site.css), so the page ends on the
	// last slide instead of scrolling the frame away to reveal the footer.
	const atEnd = opened && slide === slides - 1;
	useEffect(() => {
		const root = document.documentElement;
		root.classList.add('story-deck');
		return () => root.classList.remove('story-deck', 'story-end');
	}, []);
	useEffect(() => {
		document.documentElement.classList.toggle('story-end', atEnd);
	}, [atEnd]);

	// Measure where each slide sits, and settle on the nearest slide once
	// scrolling stops.
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
			setOpened((window.scrollY - start) / step > 0.98);
			setFooterHeight(document.querySelector('footer')?.offsetHeight ?? 0);

			snap?.destroy();
			if (!lenis) return;
			snap = new Snap(lenis, { debounce: 150, duration: 0.6 });
			for (let i = 0; i < slides; i++) snap.add(start + i * step);
		};
		setup();
		window.addEventListener('resize', setup);
		return () => {
			window.removeEventListener('resize', setup);
			snap?.destroy();
		};
	}, [lenis, slides, slideAt, setSlide]);

	const goTo = (index: number) => {
		const target = metrics.current.start + index * metrics.current.step;
		if (lenis) lenis.scrollTo(target, { duration: 1 });
		else window.scrollTo({ top: target, behavior: 'smooth' });
	};

	const current = Math.max(0, slide - 1);
	const phase = phases[current];
	const isLast = current === phases.length - 1;

	return (
		<MotionConfig reducedMotion='user'>
			<FrameLines open={spread} />
			<div
				ref={container}
				className='[--nav:3.5rem] sm:[--nav:4rem]'
				style={{ height: `calc(${slides - 1} * 90svh + 100svh - var(--nav))` }}
			>
				<motion.div
					ref={frame}
					style={{
						maxWidth: frameWidth,
						paddingBottom: atEnd ? footerHeight : undefined,
					}}
					className='sticky transition-[padding] duration-500 top-(--nav) mx-auto flex h-[calc(100svh-var(--nav))] w-full flex-col px-8 pt-6 pb-6 md:px-18 md:pt-10 md:pb-8'
				>
					{/* Phase title, top left */}
					<div
						aria-hidden='true'
						className='relative h-10 shrink-0 overflow-hidden perspective-[800px] md:h-12'
					>
						<AnimatePresence initial={false} custom={dir}>
							{opened && (
								<motion.h2
									key={phase.id}
									custom={dir}
									variants={drum}
									initial='enter'
									animate='center'
									exit='exit'
									transition={{ duration: 0.55, ease }}
									className={classNames(
										'absolute inset-x-0 top-0 text-2xl font-bold whitespace-nowrap text-primary-500 md:text-3xl',
										merryWeather.className,
									)}
								>
									{phase.title}
								</motion.h2>
							)}
						</AnimatePresence>
					</div>

					<div className='grid min-h-0 flex-1 grid-rows-[auto_1fr] gap-4 md:grid-cols-[1fr_1.15fr] md:grid-rows-1 md:items-center md:gap-14'>
						{/* Photo on the intro, then the desk */}
						<div className='relative mx-auto w-full max-w-[calc(30svh*4/3)] md:order-2 md:max-w-none'>
							<motion.div aria-hidden='true' style={{ clipPath: deskReveal }}>
								<DeskScene phases={phases} phase={current} />
							</motion.div>
							<motion.div
								style={{
									opacity: photoOpacity,
									scale: photoScale,
									filter: photoBlur,
								}}
								className='pointer-events-none absolute inset-0 flex items-center justify-center'
							>
								<Image
									src={avatar}
									alt={title}
									width={640}
									height={640}
									priority
									sizes='(min-width: 768px) 28rem, 30svh'
									className='aspect-square h-[92%] w-auto rounded-3xl object-cover'
								/>
							</motion.div>
						</div>

						<div className='grid min-h-0 md:order-1'>
							<motion.section
								inert={slide !== 0}
								style={{ opacity: introOpacity, y: introY }}
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
								<button
									type='button'
									onClick={() => goTo(1)}
									className='underline-magical mt-6 inline-block cursor-pointer text-base md:text-lg'
								>
									My journey &darr;
								</button>
							</motion.section>

							{/* The paragraph: old one leaves, then the new one arrives */}
							<div
								aria-hidden='true'
								inert={!opened}
								className='[grid-area:1/1] min-h-0 self-center'
							>
								<AnimatePresence mode='wait' initial={false} custom={dir}>
									{opened && (
										<motion.div
											key={phase.id}
											initial={{ opacity: 0, y: dir * 14, filter: 'blur(6px)' }}
											animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
											exit={{ opacity: 0, y: dir * -8, filter: 'blur(4px)' }}
											transition={{ duration: 0.4, ease }}
											data-lenis-prevent
											className='max-h-full overflow-y-auto text-base sm:text-lg lg:text-xl'
										>
											{prose[current]}
											{isLast && (
												<div className='mt-4 flex gap-5 text-base'>
													<Link href='/blog' className='underline-magical'>
														Read the blog &rarr;
													</Link>
													<Link href='/projects' className='underline-magical'>
														See projects &rarr;
													</Link>
												</div>
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>

					{/* Goals so far, growing by one per phase */}
					<ul
						aria-hidden='true'
						className='mt-4 flex min-h-5 shrink-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs md:text-sm'
					>
						<AnimatePresence initial={false}>
							{phases.slice(0, opened ? current + 1 : 0).map((p, i) => (
								<motion.li
									key={p.id}
									layout
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.4, ease }}
									className='flex items-center gap-2'
								>
									{i > 0 && <span className='text-gray-400'>&rarr;</span>}
									<span
										className={classNames(
											'relative transition-colors duration-300',
											i === current ? 'text-primary-500' : 'text-gray-500',
										)}
									>
										{p.goal}
										<motion.span
											className='absolute top-1/2 left-0 h-px w-full origin-left bg-primary-500'
											initial={false}
											animate={{ scaleX: i < current ? 1 : 0 }}
											transition={{ duration: 0.4, ease }}
										/>
									</span>
								</motion.li>
							))}
						</AnimatePresence>
					</ul>
				</motion.div>
			</div>

			{/* The phases as plain text, for screen readers. */}
			<ol className='sr-only'>
				{phases.map((p, i) => (
					<li key={p.id}>
						<h2>{p.title}</h2>
						<p>Goal: {p.goal}</p>
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
