'use client';

import {
	animate,
	type MotionValue,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
} from 'motion/react';
import { createContext, type ReactNode, use } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

interface Frame {
	/** 0: the vertical lines sit on the 64rem column; 1: off screen. */
	open: MotionValue<number>;
	/** 0: nav and footer are 64rem wide; 1: as wide as the home story. */
	wide: MotionValue<number>;
}

const FrameContext = createContext<Frame | null>(null);

export function useFrame() {
	const frame = use(FrameContext);
	if (!frame) throw new Error('useFrame must be used inside FrameProvider');
	return frame;
}

/** Animate the frame to a state; used when a page opens or closes it. */
export function animateFrame(value: MotionValue<number>, to: number) {
	return animate(value, to, { duration: 0.8, ease });
}

const line =
	'pointer-events-none fixed inset-y-0 z-30 w-px bg-gray-200 dark:bg-gray-300/20';

/**
 * The site's two vertical frame lines, drawn once for the whole site so
 * they never disappear or re-draw when you move between pages; pages only
 * move them. At `open` = 0 they sit on the edges of the 64rem column, at 1
 * they have slid off screen. `wide` widens the nav and footer rows (through
 * --frame-wide, see site.css) to follow the home story's wider frame.
 *
 * The nav, footer and page containers keep their own side borders hidden
 * (site.css), so these are the only frame lines.
 */
export function FrameProvider({ children }: { children: ReactNode }) {
	const open = useMotionValue(0);
	const wide = useMotionValue(0);

	const right = useTransform(open, (value) =>
		typeof window === 'undefined'
			? 0
			: value * (Math.max(0, (window.innerWidth - 1024) / 2) + 8),
	);
	const left = useTransform(right, (x) => -x);

	useMotionValueEvent(wide, 'change', (value) =>
		document.documentElement.style.setProperty('--frame-wide', String(value)),
	);

	return (
		<FrameContext value={{ open, wide }}>
			{children}
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
		</FrameContext>
	);
}
