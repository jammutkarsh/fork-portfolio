'use client';

import {
	type MotionValue,
	motion,
	useMotionTemplate,
	useTransform,
} from 'motion/react';
import type { PhaseMeta } from './get-story';

const PRIMARY = '#ff5f00'; // utc-ds --ds-primary

/**
 * The world behind the home story. Two soft glows take on the colour of the
 * phase being read and drift as you scroll, a dot grid slides past, and the
 * phase's year sits huge in the background, handing over to the next one.
 * All of it follows `p` (-1 on the intro, then 0 … phases - 1), so the world
 * changes gradually with the scroll, never in a jump.
 */
export default function WorldBackdrop({
	p,
	outro,
	phases,
}: {
	p: MotionValue<number>;
	/** 0 during the story, 1 once it has scrolled past its last chapter. */
	outro: MotionValue<number>;
	phases: PhaseMeta[];
}) {
	const stops = [-1, ...phases.map((_, i) => i)];
	const colors = [PRIMARY, ...phases.map((phase) => phase.color)];
	const glowA = useTransform(p, stops, colors);
	const glowB = useTransform(
		p,
		stops.map((stop) => stop - 0.5),
		colors,
	);
	const ax = useTransform(p, (v) => 22 + 14 * Math.sin(v * 1.3));
	const ay = useTransform(p, (v) => 28 + 12 * Math.cos(v * 0.9));
	const bx = useTransform(p, (v) => 78 + 12 * Math.cos(v * 1.1));
	const by = useTransform(p, (v) => 72 + 14 * Math.sin(v * 0.8));
	const background = useMotionTemplate`radial-gradient(45% 40% at ${ax}% ${ay}%, ${glowA}, transparent), radial-gradient(40% 45% at ${bx}% ${by}%, ${glowB}, transparent)`;
	const gridY = useTransform(p, (v) => `0px ${v * -48}px`);
	const yearsOpacity = useTransform(outro, [0, 1], [1, 0]);

	return (
		<div
			aria-hidden='true'
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
			<motion.div
				className='absolute inset-0'
				style={{ opacity: yearsOpacity }}
			>
				{phases.map((phase, i) => (
					<Year key={phase.id} p={p} i={i} year={phase.year} />
				))}
			</motion.div>
		</div>
	);
}

function Year({
	p,
	i,
	year,
}: {
	p: MotionValue<number>;
	i: number;
	year?: number;
}) {
	const opacity = useTransform(
		p,
		[i - 0.6, i - 0.2, i + 0.2, i + 0.6],
		[0, 1, 1, 0],
	);
	const y = useTransform(p, [i - 0.6, i + 0.6], [80, -80]);
	return (
		<motion.span
			style={{ opacity, y }}
			className='absolute right-3 bottom-[4svh] font-mono text-[30vw] font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_var(--ds-border-strong)] md:right-8 md:text-[16vw]'
		>
			{year ?? new Date().getFullYear()}
		</motion.span>
	);
}
