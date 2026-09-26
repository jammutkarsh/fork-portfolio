'use client';

import classNames from 'classnames';
import { useLenis } from 'lenis/react';
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useScroll,
} from 'motion/react';
import Link from 'next/link';
import { type ReactNode, useRef, useState } from 'react';
import { merryWeather } from '../../fonts';
import type { PhaseMeta } from './get-story';
import { Sticker, type StickerId } from './stickers';
import useMediaQuery from './use-media-query';

/** Where each sticker is pinned: % of the board, width in px, tilt in deg. */
const pins: Record<StickerId, { x: number; y: number; w: number; r: number }> =
	{
		controller: { x: 55, y: 40, w: 120, r: -8 },
		'fps-counter': { x: 5, y: 3, w: 104, r: 6 },
		'racing-flag': { x: 78, y: 62, w: 112, r: 10 },
		terminal: { x: 60, y: 68, w: 124, r: 4 },
		penguin: { x: 31, y: 81, w: 92, r: -6 },
		'wifi-cracked': { x: 52, y: 6, w: 100, r: -4 },
		'exam-sheet': { x: 80, y: 40, w: 112, r: 8 },
		'hard-drive': { x: 21, y: 2, w: 96, r: -10 },
		magnet: { x: 5, y: 81, w: 88, r: 12 },
		laptop: { x: 62, y: 50, w: 124, r: -3 },
		'server-rack': { x: 37, y: 2, w: 100, r: 5 },
		whale: { x: 17, y: 80, w: 116, r: -5 },
		gopher: { x: 55, y: 26, w: 112, r: -6 },
		'merged-pr': { x: 72, y: 82, w: 124, r: -4 },
		'go-run': { x: 55, y: 85, w: 112, r: 3 },
		'open-quote': { x: 79, y: 38, w: 108, r: 6 },
		'heart-code': { x: 62, y: 72, w: 104, r: -8 },
		'badge-now': { x: 42, y: 78, w: 104, r: 10 },
	};

const spring = { type: 'spring', stiffness: 260, damping: 22 } as const;

/**
 * The story as a vision board: while the section is pinned, each phase
 * slaps its stickers onto the board, rewrites the goal note and swaps the
 * index card. Older stickers fade until the last phase, where the whole
 * collage comes back to life as "where I stand now".
 *
 * Only on wide screens with motion allowed; everyone else (and screen
 * readers) gets `list`.
 */
export default function VisionBoard({
	phases,
	prose,
	list,
}: {
	phases: PhaseMeta[];
	prose: ReactNode[];
	list: ReactNode;
}) {
	const enhanced = useMediaQuery(
		'(min-width: 768px) and (prefers-reduced-motion: no-preference)',
	);
	if (!enhanced) return list;

	return (
		<>
			<div className='sr-only'>{list}</div>
			<Board phases={phases} prose={prose} />
		</>
	);
}

function Board({ phases, prose }: { phases: PhaseMeta[]; prose: ReactNode[] }) {
	const ref = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);
	const lenis = useLenis();
	const last = phases.length - 1;
	const done = active === last;

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start start', 'end end'],
	});
	useMotionValueEvent(scrollYProgress, 'change', (progress) => {
		setActive(Math.min(last, Math.floor(progress * phases.length)));
	});

	const goTo = (index: number) => {
		const el = ref.current;
		if (!el) return;
		const top = el.getBoundingClientRect().top + window.scrollY;
		const range = el.offsetHeight - window.innerHeight;
		const target = top + ((index + 0.5) / phases.length) * range;
		if (lenis) lenis.scrollTo(target);
		else window.scrollTo({ top: target, behavior: 'smooth' });
	};

	return (
		<div
			ref={ref}
			aria-hidden='true'
			style={{ height: `calc(${phases.length} * 80svh + 100svh)` }}
		>
			<div className='sticky top-16 flex h-[calc(100svh-4rem)] flex-col gap-3 py-4'>
				<div className='story-board relative flex-1 overflow-hidden rounded-2xl border border-black/10 shadow-inner dark:border-white/10'>
					{phases.map((phase, index) =>
						phase.stickers.map((id) => {
							const pin = pins[id];
							const shown = index <= active;
							const faded = shown && index < active && !done;
							return (
								<motion.div
									key={id}
									className='absolute'
									style={{
										left: `${pin.x}%`,
										top: `${pin.y}%`,
										width: pin.w,
										zIndex: index + 1,
									}}
									initial={false}
									animate={
										shown
											? {
													opacity: faded ? 0.5 : 1,
													scale: faded ? 0.9 : 1,
													rotate: pin.r,
													y: 0,
													filter: faded ? 'grayscale(0.8)' : 'grayscale(0)',
												}
											: {
													opacity: 0,
													scale: 1.6,
													rotate: pin.r + 25,
													y: -60,
													filter: 'grayscale(0)',
												}
									}
									transition={{
										...spring,
										delay: shown && index === active ? 0.08 : 0,
									}}
								>
									<Sticker id={id} className='h-auto w-full' />
								</motion.div>
							);
						}),
					)}

					<GoalNote phases={phases} active={active} />

					<AnimatePresence mode='wait' initial={false}>
						<motion.article
							key={active}
							className='absolute top-1/2 left-[4%] z-20 w-[min(27rem,46%)] -translate-y-1/2'
							initial={{ opacity: 0, y: 40, rotate: -4 }}
							animate={{ opacity: 1, y: 0, rotate: 0 }}
							exit={{ opacity: 0, y: -30, rotate: 2 }}
							transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
						>
							<div className='relative max-h-[62svh] overflow-auto rounded-sm border-t-4 border-primary-500 bg-white p-6 shadow-xl dark:bg-stone-800'>
								<p className='font-mono text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400'>
									Phase {String(active + 1).padStart(2, '0')} /{' '}
									{String(phases.length).padStart(2, '0')}
								</p>
								<h3
									className={classNames(
										'mt-1 mb-2 text-2xl font-bold lg:text-3xl',
										merryWeather.className,
									)}
								>
									{phases[active].title}
								</h3>
								<div className='text-[15px]'>{prose[active]}</div>
								{done && (
									<div className='mt-3 flex gap-5 text-base'>
										<Link
											href='/blog'
											tabIndex={-1}
											className='underline-magical'
										>
											Read the blog &rarr;
										</Link>
										<Link
											href='/projects'
											tabIndex={-1}
											className='underline-magical'
										>
											See projects &rarr;
										</Link>
									</div>
								)}
							</div>
							<span className='absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-primary-500 shadow-md ring-2 ring-white/60' />
						</motion.article>
					</AnimatePresence>
				</div>

				<nav className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm'>
					{phases.map((phase, index) => (
						<button
							key={phase.id}
							type='button'
							tabIndex={-1}
							onClick={() => goTo(index)}
							className={classNames(
								'flex cursor-pointer items-center gap-1.5 transition-colors',
								index === active
									? 'text-primary-500'
									: 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100',
							)}
						>
							<span
								className={classNames(
									'size-2 rounded-full transition-colors',
									index <= active ? 'bg-primary-500' : 'bg-gray-400/50',
								)}
							/>
							{phase.title}
						</button>
					))}
				</nav>
			</div>
		</div>
	);
}

/** Sticky note listing every goal so far; past goals get struck out. */
function GoalNote({ phases, active }: { phases: PhaseMeta[]; active: number }) {
	return (
		<div className='absolute top-[5%] right-[4%] z-10 w-52 rotate-3 bg-yellow-200 p-4 font-mono text-sm text-gray-900 shadow-lg'>
			<p className='mb-2 text-xs font-bold uppercase tracking-widest text-gray-600'>
				Goal
			</p>
			<ul className='space-y-1'>
				{phases.slice(0, active + 1).map((phase, index) => {
					const current = index === active;
					return (
						<motion.li
							key={phase.id}
							className={classNames(
								'relative w-fit',
								current ? 'font-bold' : 'text-gray-500',
							)}
							initial={{ clipPath: 'inset(0 100% 0 0)' }}
							animate={{ clipPath: 'inset(0 0% 0 0)' }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
						>
							{phase.goal}
							<motion.span
								className='absolute top-1/2 left-0 h-0.5 w-full origin-left bg-primary-500'
								initial={false}
								animate={{ scaleX: current ? 0 : 1 }}
								transition={{ duration: 0.4, ease: 'easeInOut' }}
							/>
						</motion.li>
					);
				})}
			</ul>
		</div>
	);
}
