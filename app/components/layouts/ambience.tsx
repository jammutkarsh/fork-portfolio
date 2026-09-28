'use client';

import {
	animate,
	type MotionValue,
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useTransform,
} from 'motion/react';
import { createContext, type ReactNode, use, useEffect } from 'react';

export const PRIMARY = '#ff5f00'; // utc-ds --ds-primary

const ease = [0.22, 1, 0.36, 1] as const;

interface Ambience {
	/** Drives the glows' drift and the dot grid's slide. */
	drift: MotionValue<number>;
	glowA: MotionValue<string>;
	glowB: MotionValue<string>;
	/** 0 hides the background (pages that don't use it), 1 shows it. */
	visible: MotionValue<number>;
}

const AmbienceContext = createContext<Ambience | null>(null);

/**
 * The site's ambient background: two soft glows that drift over a dot grid
 * sliding past. It is drawn once for the whole site, outside the page
 * transition, so it never flashes over the nav while pages crossfade; pages
 * only steer it (useAmbience), and it glides from one page's colours to the
 * next. Pages that don't use it let it fade out.
 */
export function AmbienceProvider({ children }: { children: ReactNode }) {
	const drift = useMotionValue(0);
	const glowA = useMotionValue(PRIMARY);
	const glowB = useMotionValue(PRIMARY);
	const visible = useMotionValue(0);

	const ax = useTransform(drift, (v) => 22 + 14 * Math.sin(v * 1.3));
	const ay = useTransform(drift, (v) => 28 + 12 * Math.cos(v * 0.9));
	const bx = useTransform(drift, (v) => 78 + 12 * Math.cos(v * 1.1));
	const by = useTransform(drift, (v) => 72 + 14 * Math.sin(v * 0.8));
	const background = useMotionTemplate`radial-gradient(45% 40% at ${ax}% ${ay}%, ${glowA}, transparent), radial-gradient(40% 45% at ${bx}% ${by}%, ${glowB}, transparent)`;
	const gridY = useTransform(drift, (v) => `0px ${v * -48}px`);

	return (
		<AmbienceContext value={{ drift, glowA, glowB, visible }}>
			{children}
			<motion.div
				aria-hidden='true'
				style={{ opacity: visible }}
				className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'
			>
				<motion.div
					className='absolute inset-0 opacity-[0.14] dark:opacity-[0.22]'
					style={{ background }}
				/>
				<motion.div
					className='absolute inset-0 text-(--ds-border-strong) opacity-60 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]'
					style={{ backgroundPosition: gridY }}
				/>
			</motion.div>
		</AmbienceContext>
	);
}

/**
 * Shows the ambient background while the calling page is mounted, with its
 * glows taking their colours from `colors` (at the matching `stops` of `p`)
 * and drifting as `p` changes. On arrival the background glides from the
 * previous page's look to this one's, then follows `p`.
 */
export function useAmbience(
	p: MotionValue<number>,
	stops: number[],
	colors: string[],
) {
	const ambience = use(AmbienceContext);
	if (!ambience) throw new Error('useAmbience needs an AmbienceProvider');
	const reduceMotion = useReducedMotion();
	const glowA = useTransform(p, stops, colors);
	const glowB = useTransform(
		p,
		stops.map((stop) => stop - 0.5),
		colors,
	);

	useEffect(() => {
		const { drift, visible } = ambience;
		const pairs = [
			[drift, p],
			[ambience.glowA, glowA],
			[ambience.glowB, glowB],
		] as [MotionValue<number | string>, MotionValue<number | string>][];
		const duration = reduceMotion ? 0 : 0.8;
		let following = false;
		const glides = [
			animate(visible, 1, { duration, ease }),
			...pairs.map(([target, source]) =>
				animate(target, source.get(), { duration, ease }),
			),
		];
		Promise.all(glides).then(() => {
			following = true;
			for (const [target, source] of pairs) target.set(source.get());
		});
		const unsubscribe = pairs.map(([target, source]) =>
			source.on('change', (value) => {
				if (following) target.set(value);
			}),
		);
		return () => {
			for (const stop of unsubscribe) stop();
			for (const glide of glides) glide.stop();
			animate(visible, 0, { duration: reduceMotion ? 0 : 0.5, ease });
		};
	}, [ambience, p, glowA, glowB, reduceMotion]);
}

/**
 * The ambient background for the inner pages: it moves from the site's
 * orange to the page's `accent` as the page is scrolled.
 */
export function PageAmbience({ accent }: { accent: string }) {
	const { scrollYProgress } = useScroll();
	const p = useTransform(scrollYProgress, [0, 1], [0, 2]);
	useAmbience(p, [0, 2], [PRIMARY, accent]);
	return null;
}
