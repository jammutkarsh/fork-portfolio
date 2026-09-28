'use client';

import { useLenis } from 'lenis/react';
import {
	MotionConfig,
	motion,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from 'motion/react';
import Image from 'next/image';
import { type ReactNode, useEffect, useRef } from 'react';
import { animateFrame, useFrame } from '../layouts/frame';
import Chapter, { heading } from './chapter';
import DeskScene from './desk-scene';
import type { PhaseMeta } from './get-story';
import Thesis from './thesis';
import WorldBackdrop from './world-backdrop';

/**
 * Turns the reader's raw position between two chapters into the scene's:
 * the scene holds still while a chapter is in the middle of the screen and
 * moves on in between, so it never sits half-way while you read.
 */
function settle(pos: number) {
	const base = Math.floor(pos);
	const t = Math.min(1, Math.max(0, (pos - base - 0.2) / 0.6));
	return base + t * t * (3 - 2 * t);
}

/**
 * The home page as a scrolled story. The page scrolls freely (nothing snaps
 * or holds the scroll); everything else follows how far you've scrolled.
 *
 * The intro and one chapter per phase run down one column, on a thread. The
 * other column (the top of the screen on phones) is a stage that stays in
 * view: the photo dissolves into my desk, and the desk changes with each
 * phase as you scroll. Behind it all the world changes colour per phase.
 * The story ends on the thesis every phase leads back to.
 */
export default function StoryScroll({
	title,
	bio,
	avatar,
	thesis,
	closing,
	phases,
	prose,
}: {
	title: string;
	bio: string;
	avatar: string;
	thesis: string;
	closing: string;
	phases: PhaseMeta[];
	prose: ReactNode[];
}) {
	const stage = useRef<HTMLDivElement>(null);
	const list = useRef<HTMLDivElement>(null);
	// The intro, then one element per chapter.
	const stops = useRef<(HTMLElement | null)[]>([]);
	const layout = useRef({ focus: 0, centers: [] as number[], listTop: 0 });
	const reduceMotion = useReducedMotion();
	const lenis = useLenis();
	const { scrollY } = useScroll();

	// Where the reader is: -1 on the intro, i while chapter i is in the
	// middle of the free part of the screen, fractions in between.
	const pos = useMotionValue(-1);
	// How far down the chapters' thread the reader is, in pixels.
	const threadHeight = useMotionValue(0);
	// 0 until the last chapter has passed the middle of the screen, then up
	// to 1 over most of a screen's height of scrolling past it.
	const outro = useMotionValue(0);

	const settled = useTransform(pos, settle);
	const smooth = useSpring(settled, { stiffness: 140, damping: 26, mass: 0.6 });
	const scene = reduceMotion ? settled : smooth;
	const desk = useTransform(scene, (v) => Math.max(0, v));

	// Leaving the intro, the photo gives way to the desk.
	const photoOpacity = useTransform(scene, [-0.85, -0.3], [1, 0]);
	const photoScale = useTransform(scene, [-1, -0.3], [1, 0.85]);
	const photoBlur = useTransform(scene, [-1, -0.3], ['blur(0px)', 'blur(8px)']);
	const deskReveal = useTransform(
		scene,
		[-0.8, 0],
		['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'],
	);
	const introOpacity = useTransform(pos, [-1, -0.4], [1, 0.3]);
	const threadColor = useTransform(
		scene,
		phases.map((_, i) => i),
		phases.map((phase) => phase.color),
	);

	// The home page opens the frame: its lines slide off screen and the nav
	// widens to the story's width; leaving the page closes it again.
	const { open, wide } = useFrame();
	useEffect(() => {
		for (const value of [open, wide]) {
			if (reduceMotion) value.set(1);
			else animateFrame(value, 1);
		}
		return () => {
			for (const value of [open, wide]) {
				if (reduceMotion) value.set(0);
				else animateFrame(value, 0);
			}
		};
	}, [open, wide, reduceMotion]);

	// Track the reader's position. The layout is measured on resize; on
	// scroll only the scroll offset changes.
	useEffect(() => {
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
			const stageBox = s.getBoundingClientRect();
			const listBox = l.getBoundingClientRect();
			const nav = Number.parseFloat(getComputedStyle(s).top) || 0;
			// On phones the stage sits above the text; the text is read in
			// the part of the screen below it.
			const stacked =
				stageBox.left < listBox.right - 1 && stageBox.right > listBox.left + 1;
			const top = stacked ? nav + stageBox.height : nav;
			layout.current = {
				focus: top + (window.innerHeight - top) / 2,
				centers: stops.current.map((el) =>
					el ? el.getBoundingClientRect().top + y + el.offsetHeight / 2 : 0,
				),
				listTop: listBox.top + y,
			};
			update(y);
		};
		measure();
		const resize = new ResizeObserver(measure);
		if (list.current) resize.observe(list.current);
		if (stage.current) resize.observe(stage.current);
		window.addEventListener('resize', measure);
		const unsubscribe = scrollY.on('change', update);
		return () => {
			resize.disconnect();
			window.removeEventListener('resize', measure);
			unsubscribe();
		};
	}, [scrollY, pos, threadHeight, outro]);

	// Scroll so that stop `index` (0 = intro, 1 = first chapter) is centred.
	const goTo = (index: number) => {
		const { focus, centers } = layout.current;
		const target = Math.max(0, centers[index] - focus);
		if (lenis) lenis.scrollTo(target, { duration: 1.4 });
		else window.scrollTo({ top: target, behavior: 'smooth' });
	};

	return (
		<MotionConfig reducedMotion='user'>
			<WorldBackdrop p={scene} outro={outro} phases={phases} />

			<div className='mx-auto grid w-full max-w-[90rem] grid-cols-1 px-5 [--nav:3.5rem] sm:px-8 sm:[--nav:4rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-14 md:px-18 [@media(max-height:500px)]:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] [@media(max-height:500px)]:gap-8'>
				{/* The stage: photo, then the desk. Stays in view while the text scrolls. */}
				<div
					ref={stage}
					className='sticky top-(--nav) z-10 -mx-5 flex h-[42svh] items-center justify-center self-start border-b border-(--ds-border) bg-[color-mix(in_oklch,var(--ds-bg-primary)_78%,transparent)] px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 md:col-start-2 md:row-start-1 md:mx-0 md:h-[calc(100svh-var(--nav))] md:border-0 md:bg-transparent md:px-0 md:backdrop-blur-none [@media(max-height:500px)]:col-start-2 [@media(max-height:500px)]:row-start-1 [@media(max-height:500px)]:mx-0 [@media(max-height:500px)]:h-[calc(100svh-var(--nav))] [@media(max-height:500px)]:border-0 [@media(max-height:500px)]:bg-transparent [@media(max-height:500px)]:px-0 [@media(max-height:500px)]:backdrop-blur-none'
				>
					<div className='relative flex aspect-4/3 h-full max-w-full items-center md:h-auto md:w-full [@media(max-height:500px)]:h-auto [@media(max-height:500px)]:w-full'>
						<motion.div
							aria-hidden='true'
							className='w-full'
							style={{ clipPath: deskReveal }}
						>
							<DeskScene phases={phases} p={desk} />
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
								sizes='(min-width: 768px) 28rem, 40svh'
								className='aspect-square h-[92%] w-auto rounded-(--ds-radius-lg) object-cover'
							/>
						</motion.div>
					</div>
				</div>

				<div className='min-w-0 md:col-start-1 md:row-start-1 [@media(max-height:500px)]:col-start-1 [@media(max-height:500px)]:row-start-1'>
					{/* Intro */}
					<motion.section
						ref={(el) => {
							stops.current[0] = el;
						}}
						style={{ opacity: introOpacity }}
						className='flex min-h-[calc(58svh-var(--nav))] flex-col justify-center py-8 md:min-h-[calc(100svh-var(--nav))] [@media(max-height:500px)]:min-h-[calc(100svh-var(--nav))]'
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

			<Thesis thesis={thesis} closing={closing} />
		</MotionConfig>
	);
}
