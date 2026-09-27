'use client';

import { motion, useReducedMotion, useTransform } from 'motion/react';
import { type ReactNode, useEffect } from 'react';
import { animateFrame, useFrame } from './frame';

/**
 * A detail page (blog post, project) opens up: the frame lines slide off
 * screen and the page widens, leaving room for wide content such as code
 * blocks and images. The nav and footer stay aligned with the text column.
 * Leaving the page closes the frame again.
 */
export default function OpenFrame({ children }: { children: ReactNode }) {
	const { open } = useFrame();
	const reduceMotion = useReducedMotion();
	const maxWidth = useTransform(
		open,
		(value) => `calc(64rem + ${value} * (min(100vw, 80rem) - 64rem))`,
	);

	useEffect(() => {
		if (reduceMotion) open.set(1);
		else animateFrame(open, 1);
		return () => {
			if (reduceMotion) open.set(0);
			else animateFrame(open, 0);
		};
	}, [open, reduceMotion]);

	return (
		<motion.main
			style={{ maxWidth }}
			className='mx-auto flex w-full flex-1 flex-col px-5 py-8 pt-12 sm:px-8 md:px-18 md:py-18 md:pt-14'
		>
			{children}
		</motion.main>
	);
}
