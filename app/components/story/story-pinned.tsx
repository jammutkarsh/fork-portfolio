'use client';

import { useLenis } from 'lenis/react';
import {
	type MotionStyle,
	type MotionValue,
	motion,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
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
	/** The chapter this stop belongs to; -1 for the intro. */
	chapter: number;
}

// A chapter's text as a paragraph, the same in the pages and the measurer.
const paragraph = 'py-1.5 leading-relaxed text-(--ds-text-primary)';
// Space the pages keep clear at the top and bottom of the text area (pt-5,
// pb-8), where it fades out.
const PAGE_PADDING = 20 + 32;

/** The sentences `from` … `to` of a chapter, as one paragraph. */
function Sentences({
	sentences,
	from = 0,
	to = sentences.length,
}: {
	sentences: ReactNode[];
	from?: number;
	to?: number;
}) {
	return (
		<p className={paragraph}>
			{sentences.slice(from, to).map((sentence, j) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: sentences are fixed
				<span key={from + j}>{sentence} </span>
			))}
		</p>
	);
}

/**
 * Splits each chapter's sentences into pages that fit `room` pixels, from
 * the measurer's copy of the text: a page ends before the sentence that
 * would run past it. One line is kept spare, as a sentence can wrap one line
 * differently once it starts a page. Returns each page's first sentence.
 */
function paginate(measurer: HTMLElement, room: number) {
	return [...measurer.querySelectorAll<HTMLElement>('[data-chapter]')].map(
		(chapter) => {
			const para = chapter.firstElementChild as HTMLElement;
			const spans = [...para.children] as HTMLElement[];
			const line = Number.parseFloat(getComputedStyle(para).lineHeight) || 26;
			const limit = room - 12 - line;
			const starts = [0];
			let top = spans[0]?.getClientRects()[0]?.top ?? 0;
			spans.forEach((span, j) => {
				if (j === starts[starts.length - 1]) return;
				const rects = span.getClientRects();
				if (!rects.length) return;
				if (rects[rects.length - 1].bottom - top > limit) {
					starts.push(j);
					top = rects[0].top;
				}
			});
			return starts;
		},
	);
}

/**
 * The story on phones held upright: one frame fills the screen and stays
 * put, with the chapter title at the top, my photo (then the desk) under it
 * and the text below. Scrolling the page moves the story along; nothing
 * snaps. Between chapters the title, desk and text cross over. A chapter
 * whose text is longer than its space is split into pages that fit, which
 * turn over as you scroll while the title and desk stay, so text never has
 * to scroll on its own.
 */
export default function StoryPinned({
	title,
	bio,
	avatar,
	phases,
	prose,
	sentences,
	pos,
	scene,
	active,
}: {
	title: string;
	bio: string;
	avatar: string;
	phases: PhaseMeta[];
	prose: ReactNode[];
	/** Each phase's prose, one sentence at a time. */
	sentences: ReactNode[][];
	pos: MotionValue<number>;
	scene: MotionValue<number>;
	/** Whether this layout is the one on screen, and so drives `pos`. */
	active: boolean;
}) {
	const container = useRef<HTMLDivElement>(null);
	const frame = useRef<HTMLDivElement>(null);
	const area = useRef<HTMLDivElement>(null);
	const measurer = useRef<HTMLDivElement>(null);
	const plan = useRef({ start: 0, stops: [] as Stop[] });
	// Each chapter's pages, as the index of each page's first sentence.
	const [pages, setPages] = useState(() => phases.map(() => [0]));
	const [height, setHeight] = useState<number>();
	const reduceMotion = useReducedMotion();
	const lenis = useLenis();
	const { scrollY } = useScroll();

	// Which text is on: 0 for the intro, then each page in turn (fractions
	// in between). Like the scene, it holds while a page is on.
	const textPos = useMotionValue(0);
	const settled = useTransform(textPos, (v) => {
		const base = Math.floor(v);
		const t = Math.min(1, Math.max(0, (v - base - 0.2) / 0.6));
		return base + t * t * (3 - 2 * t);
	});
	const smooth = useSpring(settled, { stiffness: 140, damping: 26, mass: 0.6 });
	const text = reduceMotion ? settled : smooth;

	const introOpacity = useTransform(text, [0, 0.45], [1, 0]);
	const introY = useTransform(text, [0, 0.45], [0, -24]);
	const introEvents = useTransform(text, (v) => (v < 0.4 ? 'auto' : 'none'));

	useEffect(() => {
		if (!active) return;
		const update = (y: number) => {
			const { start, stops } = plan.current;
			if (!stops.length) return;
			const s = y - start;
			let t = 0;
			for (let k = 1; k < stops.length; k++) {
				const { at, enter } = stops[k];
				if (s >= at) t = k;
				else {
					if (s > at - enter) t = k - 1 + (s - (at - enter)) / enter;
					break;
				}
			}
			const from = Math.floor(t);
			const to = Math.min(stops.length - 1, from + 1);
			const { chapter: a } = stops[from];
			const { chapter: b } = stops[to];
			textPos.set(t);
			pos.set(a + (b - a) * (t - from));
		};
		const measure = () => {
			const c = container.current;
			const f = frame.current;
			const a = area.current;
			const m = measurer.current;
			if (!c || !f || !a || !m) return;
			const next = paginate(m, a.clientHeight - PAGE_PADDING);
			setPages((prev) =>
				JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
			);
			const vh = window.innerHeight;
			const nav = Number.parseFloat(getComputedStyle(f).top) || 0;
			const stops: Stop[] = [{ at: 0, enter: 0, chapter: -1 }];
			let at = 0.25 * vh;
			next.forEach((starts, chapter) => {
				starts.forEach((_, page) => {
					const enter = (page === 0 ? 0.5 : 0.4) * vh;
					at += enter;
					stops.push({ at, enter, chapter });
					at += 0.3 * vh;
				});
			});
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
		if (measurer.current) resize.observe(measurer.current);
		window.addEventListener('resize', measure);
		const unsubscribe = scrollY.on('change', update);
		return () => {
			resize.disconnect();
			window.removeEventListener('resize', measure);
			unsubscribe();
		};
	}, [active, scrollY, pos, textPos]);

	const goTo = (index: number) => {
		const { start, stops } = plan.current;
		if (!stops[index]) return;
		const target = start + stops[index].at;
		if (lenis) lenis.scrollTo(target, { duration: 1.4 });
		else window.scrollTo({ top: target, behavior: 'smooth' });
	};

	// Every page in reading order; page n is text stop n + 1.
	const allPages = pages.flatMap((starts, chapter) =>
		starts.map((from, page) => ({
			chapter,
			from,
			to: starts[page + 1] ?? sentences[chapter].length,
		})),
	);

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
					className='sticky top-(--nav) flex h-[calc(100svh-var(--nav))] flex-col px-5 pt-6 pb-2 sm:px-8'
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

					{/* The intro, then each page of text, in the same space */}
					<div
						ref={area}
						className='relative mt-3 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_1.25rem,black_calc(100%-2rem),transparent)]'
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

						{allPages.map(({ chapter, from, to }, n) => (
							<Page key={`${chapter}-${from}`} text={text} stop={n + 1}>
								<Sentences sentences={sentences[chapter]} from={from} to={to} />
							</Page>
						))}

						{/* An invisible copy of every chapter's text, to find page breaks */}
						<div
							ref={measurer}
							aria-hidden='true'
							className='invisible absolute inset-x-0 top-0 text-base'
						>
							{sentences.map((chapter, c) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: chapters are fixed
								<div key={c} data-chapter={c}>
									<Sentences sentences={chapter} />
								</div>
							))}
						</div>
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

/** 1 while stop `i` is on, fading out half a stop away. */
function useBump(value: MotionValue<number>, i: number) {
	return useTransform(
		value,
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

/** A page of chapter text: on while the text position is at `stop`. */
function Page({
	text,
	stop,
	children,
}: {
	text: MotionValue<number>;
	stop: number;
	children: ReactNode;
}) {
	const opacity = useBump(text, stop);
	const y = useTransform(text, [stop - 0.5, stop, stop + 0.5], [14, 0, -8]);
	const pointerEvents = useTransform(opacity, (o) =>
		o > 0.5 ? 'auto' : 'none',
	);
	return (
		<motion.div
			aria-hidden='true'
			style={{ opacity, y, pointerEvents }}
			className='[grid-area:1/1] self-start pt-5 pb-8 text-base'
		>
			{children}
		</motion.div>
	);
}
