'use client';

import {
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from 'motion/react';
import { type ReactNode, useEffect } from 'react';
import FrameLines from './frame-lines';

/**
 * A detail page (blog post, project) opens up: its frame lines slide off
 * screen and the page widens, leaving room for wide content such as code
 * blocks and images.
 */
export default function OpenFrame({ children }: { children: ReactNode }) {
	const open = useMotionValue(0);
	const reduceMotion = useReducedMotion();
	const maxWidth = useTransform(
		open,
		(value) => `calc(64rem + ${value} * (min(100vw, 80rem) - 64rem))`,
	);

	useEffect(() => {
		if (reduceMotion) {
			open.set(1);
			return;
		}
		const controls = animate(open, 1, {
			duration: 0.9,
			delay: 0.15,
			ease: [0.22, 1, 0.36, 1],
		});
		return () => controls.stop();
	}, [open, reduceMotion]);

	return (
		<>
			<FrameLines open={open} />
			<motion.main
				style={{ maxWidth }}
				className='mx-auto flex w-full flex-1 flex-col p-8 pt-12 md:p-18 md:pt-14'
			>
				{children}
			</motion.main>
		</>
	);
}
