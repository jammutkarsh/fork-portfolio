'use client';

import { type MotionValue, motion, useTransform } from 'motion/react';
import { useEffect } from 'react';

const line =
	'pointer-events-none fixed inset-y-0 z-30 w-px bg-gray-200 dark:bg-gray-300/20';

/**
 * The site's two vertical frame lines, drawn so they can move: at
 * `open` = 0 they sit on the edges of the 64rem column (where the nav's and
 * footer's side borders are), and at 1 they have slid off screen. While
 * mounted, site.css hides the nav's and footer's own side borders.
 */
export default function FrameLines({ open }: { open: MotionValue<number> }) {
	const right = useTransform(open, (value) =>
		typeof window === 'undefined'
			? 0
			: value * (Math.max(0, (window.innerWidth - 1024) / 2) + 8),
	);
	const left = useTransform(right, (x) => -x);

	useEffect(() => {
		document.documentElement.classList.add('frame-lines');
		return () => document.documentElement.classList.remove('frame-lines');
	}, []);

	return (
		<>
			<motion.div
				aria-hidden='true'
				className={`${line} left-[max(0px,calc(50vw-32rem))]`}
				style={{ x: left }}
			/>
			<motion.div
				aria-hidden='true'
				className={`${line} right-[max(0px,calc(50vw-32rem))]`}
				style={{ x: right }}
			/>
		</>
	);
}
