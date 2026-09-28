'use client';

import { useLenis } from 'lenis/react';
import {
	type MotionValue,
	motion,
	useMotionValue,
	useScroll,
	useTransform,
} from 'motion/react';
import { type ReactNode, useEffect, useRef } from 'react';
import Chapter, { heading } from './chapter';
import type { PhaseMeta } from './get-story';
import Stage from './stage';

/**
 * The story on wide screens (and phones held sideways): the intro and one
 * chapter per phase run down the left column, on a thread; the stage stays
 * in view on the right. The page scrolls freely, and `pos` follows which
 * chapter is in the middle of the screen.
 */
export default function StoryColumns({
	title,
	bio,
	avatar,
	phases,
	prose,
	pos,
	outro,
	scene,
	active,
}: {
	title: string;
	bio: string;
	avatar: string;
	phases: PhaseMeta[];
	prose: ReactNode[];
	pos: MotionValue<number>;
	outro: MotionValue<number>;
	scene: MotionValue<number>;
	/** Whether this layout is the one on screen, and so drives `pos`. */
	active: boolean;
}) {
	const stage = useRef<HTMLDivElement>(null);
	const list = useRef<HTMLDivElement>(null);
	// The intro, then one element per chapter.
	const stops = useRef<(HTMLElement | null)[]>([]);
	const layout = useRef({ focus: 0, centers: [] as number[], listTop: 0 });
	const lenis = useLenis();
	const { scrollY } = useScroll();

	// How far down the chapters' thread the reader is, in pixels.
	const threadHeight = useMotionValue(0);
	const introOpacity = useTransform(pos, [-1, -0.4], [1, 0.3]);
	const threadColor = useTransform(
		scene,
		phases.map((_, i) => i),
		phases.map((phase) => phase.color),
	);

	// Track the reader's position. The layout is measured on resize; on
	// scroll only the scroll offset changes.
	useEffect(() => {
		if (!active) return;
		const update = (y: number) => {
			const { focus, centers, listTop } = layout.current;
			const at = y + focus;
			threadHeight.set(Math.max(0, at - listTop));
			if (!centers.length || at <= centers[0]) return pos.set(-1);
			const last = centers.length - 1;
			outro.set(
				Math.min(
					1,
					Math.max(0, (at - centers[last]) / (0.8 * window.innerHeight)),
				),
			);
			if (at >= centers[last]) return pos.set(last - 1);
			let k = 0;
			while (at >= centers[k + 1]) k++;
			pos.set(k - 1 + (at - centers[k]) / (centers[k + 1] - centers[k]));
		};
		const measure = () => {
			const s = stage.current;
			const l = list.current;
			if (!s || !l) return;
			const y = window.scrollY;
			const nav = Number.parseFloat(getComputedStyle(s).top) || 0;
			layout.current = {
				focus: nav + (window.innerHeight - nav) / 2,
				centers: stops.current.map((el) =>
					el ? el.getBoundingClientRect().top + y + el.offsetHeight / 2 : 0,
				),
				listTop: l.getBoundingClientRect().top + y,
			};
			update(y);
		};
		measure();
		const resize = new ResizeObserver(measure);
		if (list.current) resize.observe(list.current);
		window.addEventListener('resize', measure);
		const unsubscribe = scrollY.on('change', update);
		return () => {
			resize.disconnect();
			window.removeEventListener('resize', measure);
			unsubscribe();
		};
	}, [active, scrollY, pos, threadHeight, outro]);

	// Scroll so that stop `index` (0 = intro, 1 = first chapter) is centred.
	const goTo = (index: number) => {
		const { focus, centers } = layout.current;
		const target = Math.max(0, centers[index] - focus);
		if (lenis) lenis.scrollTo(target, { duration: 1.4 });
		else window.scrollTo({ top: target, behavior: 'smooth' });
	};

	return (
		<div className='mx-auto grid w-full max-w-[90rem] grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-8 px-5 [--nav:3.5rem] sm:px-8 sm:[--nav:4rem] md:gap-14 md:px-18'>
			{/* The stage: photo, then the desk. Stays in view while the text scrolls. */}
			<div
				ref={stage}
				className='sticky top-(--nav) col-start-2 row-start-1 flex h-[calc(100svh-var(--nav))] items-center self-start'
			>
				<Stage
					title={title}
					avatar={avatar}
					phases={phases}
					scene={scene}
					className='flex aspect-4/3 w-full items-center'
				/>
			</div>

			<div className='col-start-1 row-start-1 min-w-0'>
				{/* Intro */}
				<motion.section
					ref={(el) => {
						stops.current[0] = el;
					}}
					style={{ opacity: introOpacity }}
					className='flex min-h-[calc(100svh-var(--nav))] flex-col justify-center py-8'
				>
					<h1 className={heading}>{title}</h1>
					<p className='mt-5 text-lg text-(--ds-text-secondary)'>{bio}</p>
					<button
						type='button'
						onClick={() => goTo(1)}
						className='underline-magical mt-6 inline-block cursor-pointer self-start text-base md:text-lg'
					>
						My journey &darr;
					</button>
				</motion.section>

				{/* The chapters, on the thread that leads to the thesis */}
				<div ref={list} className='relative'>
					<div
						aria-hidden='true'
						className='absolute inset-y-0 left-0 w-px overflow-hidden bg-(--ds-border)'
					>
						<motion.div
							className='w-full'
							style={{ height: threadHeight, backgroundColor: threadColor }}
						/>
					</div>
					{phases.map((phase, i) => (
						<Chapter
							key={phase.id}
							ref={(el) => {
								stops.current[i + 1] = el;
							}}
							phase={phase}
							index={i}
							pos={pos}
						>
							{prose[i]}
						</Chapter>
					))}
				</div>
			</div>
		</div>
	);
}
