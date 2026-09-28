'use client';

import type { MotionValue } from 'motion/react';
import { Ambience, PRIMARY } from '../layouts/ambience';
import type { PhaseMeta } from './get-story';

/**
 * The world behind the home story: the site's ambient background, taking on
 * the colour of the phase being read. It follows `p` (-1 on the intro, then
 * 0 … phases - 1), so the world changes gradually with the scroll, never in
 * a jump.
 */
export default function WorldBackdrop({
	p,
	phases,
}: {
	p: MotionValue<number>;
	phases: PhaseMeta[];
}) {
	return (
		<Ambience
			p={p}
			stops={[-1, ...phases.map((_, i) => i)]}
			colors={[PRIMARY, ...phases.map((phase) => phase.color)]}
		/>
	);
}
