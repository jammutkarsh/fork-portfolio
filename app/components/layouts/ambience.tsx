'use client';

import {
	type MotionValue,
	motion,
	useMotionTemplate,
	useScroll,
	useTransform,
} from 'motion/react';
import type { ReactNode } from 'react';

export const PRIMARY = '#ff5f00'; // utc-ds --ds-primary

/**
 * The site's ambient background: two soft glows that take their colours
 * from `colors` (at the matching `stops` of `p`) and drift as `p` changes,
 * over a dot grid that slides past. Pages drive `p` from the scroll, so the
 * background shifts gradually as you scroll. `children` add more layers.
 */
export function Ambience({
	p,
	stops,
	colors,
	children,
}: {
	p: MotionValue<number>;
	stops: number[];
	colors: string[];
	children?: ReactNode;
}) {
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
			{children}
		</div>
	);
}

/**
 * The ambient background for the inner pages: it moves from the site's
 * orange to the page's `accent` as the page is scrolled.
 */
export function PageAmbience({ accent }: { accent: string }) {
	const { scrollYProgress } = useScroll();
	const p = useTransform(scrollYProgress, [0, 1], [0, 2]);
	return <Ambience p={p} stops={[0, 2]} colors={[PRIMARY, accent]} />;
}
