'use client';

import { useReducedMotion } from 'motion/react';
import { type ReactNode, useEffect } from 'react';
import { animateFrame, useFrame } from './frame';

/**
 * A detail page (blog post, project) opens up: the frame lines slide off
 * screen while the content stays in one column, aligned with the nav.
 * Leaving the page closes the frame again.
 */
export default function OpenFrame({ children }: { children: ReactNode }) {
	const { open } = useFrame();
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (reduceMotion) open.set(1);
		else animateFrame(open, 1);
		return () => {
			if (reduceMotion) open.set(0);
			else animateFrame(open, 0);
		};
	}, [open, reduceMotion]);

	return (
		<main className='mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-8 pt-12 sm:px-8 md:px-18 md:py-18 md:pt-14'>
			{children}
		</main>
	);
}
