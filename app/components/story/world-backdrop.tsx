'use client';

import { type MotionValue, motion, useTransform } from 'motion/react';
import { Ambience, PRIMARY } from '../layouts/ambience';
import type { PhaseMeta } from './get-story';

/**
 * The world behind the home story: the site's ambient background, taking on
 * the colour of the phase being read, with the phase's year sitting huge in
 * the background and handing over to the next one. All of it follows `p`
 * (-1 on the intro, then 0 … phases - 1), so the world changes gradually
 * with the scroll, never in a jump.
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
	const yearsOpacity = useTransform(outro, [0, 1], [1, 0]);

	return (
		<Ambience
			p={p}
			stops={[-1, ...phases.map((_, i) => i)]}
			colors={[PRIMARY, ...phases.map((phase) => phase.color)]}
		>
			<motion.div
				className='absolute inset-0'
				style={{ opacity: yearsOpacity }}
			>
				{phases.map((phase, i) => (
					<Year key={phase.id} p={p} i={i} year={phase.year} />
				))}
			</motion.div>
		</Ambience>
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
