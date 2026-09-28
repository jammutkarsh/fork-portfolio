'use client';

import { useLenis } from 'lenis/react';
import {
	type MotionStyle,
	type MotionValue,
	motion,
	motionValue,
	useScroll,
	useTransform,
} from 'motion/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { heading } from './chapter';
import type { PhaseMeta } from './get-story';
import Stage from './stage';

interface Stop {
	/** Scroll offset (from where the frame pins) at which this stop is on. */
	at: number;
	/** Scrolling spent moving into this stop from the previous one. */
	enter: number;
	/** Scrolling spent on this stop. */
	hold: number;
	/** How much taller the text is than its space (it scrolls by this). */
	overflow: number;
}

/**
 * The story on phones held upright: one frame fills the screen and stays
 * put, with the chapter title at the top, my photo (then the desk) under it
 * and the text below. Scrolling the page moves the story along; nothing
 * snaps. Between chapters the title, desk and text cross over; on a chapter
 * whose text is taller than its space, the page's scroll first scrolls the
 * text, so there is never a scroll box inside the page.
 */
export default function StoryPinned({
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
	const container = useRef<HTMLDivElement>(null);
	const frame = useRef<HTMLDivElement>(null);
	const area = useRef<HTMLDivElement>(null);
	const texts = useRef<(HTMLDivElement | null)[]>([]);
	// How far each chapter's text has scrolled up, in pixels.
	const [shifts] = useState(() => phases.map(() => motionValue(0)));
	const plan = useRef({ start: 0, stops: [] as Stop[] });
	const [height, setHeight] = useState<number>();
	const lenis = useLenis();
	const { scrollY } = useScroll();

	const introOpacity = useTransform(scene, [-1, -0.55], [1, 0]);
	const introY = useTransform(scene, [-1, -0.55], [0, -24]);
	const introEvents = useTransform(scene, (v) => (v < -0.6 ? 'auto' : 'none'));
	const progress = useTransform(pos, [-1, phases.length - 1], [0, 1]);
	const progressColor = useTransform(
		scene,
		phases.map((_, i) => i),
		phases.map((phase) => phase.color),
	);

	useEffect(() => {
		if (!active) return;
		const update = (y: number) => {
			const { start, stops } = plan.current;
			if (!stops.length) return;
			const s = y - start;
			let p = -1;
			for (let i = 1; i < stops.length; i++) {
				const { at, enter } = stops[i];
				if (s >= at) p = i - 1;
				else {
					if (s > at - enter) p = i - 2 + (s - (at - enter)) / enter;
					break;
				}
			}
			pos.set(p);
			// Text taller than its space scrolls 1:1 with the page, a little
			// after its chapter has arrived.
			for (let i = 1; i < stops.length; i++) {
				const { at, hold, overflow } = stops[i];
				const lead = (hold - overflow) / 2;
				shifts[i - 1].set(-Math.min(overflow, Math.max(0, s - at - lead)));
			}
			const last = stops[stops.length - 1];
			outro.set(
				Math.min(
					1,
					Math.max(0, (s - last.at - last.hold) / (0.8 * window.innerHeight)),
				),
			);
		};
		const measure = () => {
			const c = container.current;
			const f = frame.current;
			const a = area.current;
			if (!c || !f || !a) return;
			const vh = window.innerHeight;
			const nav = Number.parseFloat(getComputedStyle(f).top) || 0;
			const enter = 0.5 * vh;
			const base = 0.35 * vh;
			const room = a.clientHeight;
			const stops: Stop[] = [{ at: 0, enter: 0, hold: 0.25 * vh, overflow: 0 }];
			let at = stops[0].hold;
			for (const text of texts.current) {
				const overflow = Math.max(0, (text?.offsetHeight ?? 0) - room);
				at += enter;
				stops.push({ at, enter, hold: base + overflow, overflow });
				at += base + overflow;
			}
			plan.current = {
				start: c.getBoundingClientRect().top + window.scrollY - nav,
				stops,
			};
			setHeight(at + f.offsetHeight);
			update(window.scrollY);
		};
		measure();
		const resize = new ResizeObserver(measure);
		if (area.current) resize.observe(area.current);
		for (const text of texts.current) if (text) resize.observe(text);
		window.addEventListener('resize', measure);
		const unsubscribe = scrollY.on('change', update);
		return () => {
			resize.disconnect();
			window.removeEventListener('resize', measure);
			unsubscribe();
		};
	}, [active, scrollY, pos, outro, shifts]);

	const goTo = (index: number) => {
		const { start, stops } = plan.current;
		if (!stops[index]) return;
		const target = start + stops[index].at;
		if (lenis) lenis.scrollTo(target, { duration: 1.4 });
		else window.scrollTo({ top: target, behavior: 'smooth' });
	};

	return (
		<>
			<div
				ref={container}
				className='[--nav:3.5rem] sm:[--nav:4rem]'
				style={{
					height: height ?? `calc(${phases.length} * 110svh + 100svh)`,
				}}
			>
				<div
					ref={frame}
					className='sticky top-(--nav) flex h-[calc(100svh-var(--nav))] flex-col px-5 pt-6 pb-4 sm:px-8'
				>
					{/* Chapter title, top left */}
					<div aria-hidden='true' className='grid min-h-19 shrink-0 items-end'>
						{phases.map((phase, i) => (
							<Title key={phase.id} phase={phase} i={i} scene={scene} />
						))}
					</div>

					<Stage
						title={title}
						avatar={avatar}
						phases={phases}
						scene={scene}
						className='mx-auto mt-4 w-full max-w-[calc(30svh*4/3)] shrink-0'
					/>

					{/* The intro, then each chapter's text, in the same space */}
					<div
						ref={area}
						className='mt-3 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_1.25rem,black_calc(100%-2rem),transparent)]'
					>
						<motion.section
							style={{
								opacity: introOpacity,
								y: introY,
								pointerEvents: introEvents,
								alignSelf: 'safe center',
							}}
							className='[grid-area:1/1] py-5'
						>
							<h1 className={heading}>{title}</h1>
							<p className='mt-5 text-lg text-(--ds-text-secondary)'>{bio}</p>
							<button
								type='button'
								onClick={() => goTo(1)}
								className='underline-magical mt-6 inline-block cursor-pointer text-base'
							>
								My journey &darr;
							</button>
						</motion.section>
						{phases.map((phase, i) => (
							<Text
								key={phase.id}
								ref={(el) => {
									texts.current[i] = el;
								}}
								i={i}
								scene={scene}
								shift={shifts[i]}
							>
								{prose[i]}
							</Text>
						))}
					</div>

					{/* How far through the story */}
					<div
						aria-hidden='true'
						className='mt-2 h-px shrink-0 bg-(--ds-border)'
					>
						<motion.div
							className='h-full origin-left'
							style={{ scaleX: progress, backgroundColor: progressColor }}
						/>
					</div>
				</div>
			</div>

			{/* The chapters as plain text, for screen readers */}
			<ol className='sr-only'>
				{phases.map((phase, i) => (
					<li key={phase.id}>
						<h2>{phase.title}</h2>
						{prose[i]}
					</li>
				))}
			</ol>
		</>
	);
}

/** 1 while chapter `i` is on, fading out half a chapter away. */
function useBump(scene: MotionValue<number>, i: number) {
	return useTransform(
		scene,
		[i - 0.5, i - 0.2, i + 0.2, i + 0.5],
		[0, 1, 1, 0],
	);
}

function Title({
	phase,
	i,
	scene,
}: {
	phase: PhaseMeta;
	i: number;
	scene: MotionValue<number>;
}) {
	const opacity = useBump(scene, i);
	const y = useTransform(scene, [i - 0.5, i, i + 0.5], [12, 0, -8]);
	return (
		<motion.div
			style={{ opacity, y, '--world': phase.color } as MotionStyle}
			className='[grid-area:1/1]'
		>
			{phase.year && (
				<p className='font-mono text-xs tracking-widest text-[color-mix(in_oklch,var(--world),var(--ds-text-primary)_25%)]'>
					{phase.year}
				</p>
			)}
			<h2 className={`${heading} mt-1`}>{phase.title}</h2>
		</motion.div>
	);
}

function Text({
	ref,
	i,
	scene,
	shift,
	children,
}: {
	ref: (el: HTMLDivElement | null) => void;
	i: number;
	scene: MotionValue<number>;
	shift: MotionValue<number>;
	children: ReactNode;
}) {
	const opacity = useBump(scene, i);
	const enter = useTransform(scene, [i - 0.5, i, i + 0.5], [14, 0, -8]);
	const y = useTransform(() => shift.get() + enter.get());
	const pointerEvents = useTransform(opacity, (o) =>
		o > 0.5 ? 'auto' : 'none',
	);
	return (
		<motion.div
			ref={ref}
			aria-hidden='true'
			style={{ opacity, y, pointerEvents }}
			className='[grid-area:1/1] self-start py-5 text-base'
		>
			{children}
		</motion.div>
	);
}
