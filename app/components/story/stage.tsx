'use client';

import { type MotionValue, motion, useTransform } from 'motion/react';
import Image from 'next/image';
import DeskScene from './desk-scene';
import type { PhaseMeta } from './get-story';

/**
 * My photo on the intro, dissolving into the desk as the story starts; the
 * desk then follows the story. `scene` is the story position the scene
 * shows (-1 on the intro, then 0 … phases - 1).
 */
export default function Stage({
	title,
	avatar,
	phases,
	scene,
	className = '',
}: {
	title: string;
	avatar: string;
	phases: PhaseMeta[];
	scene: MotionValue<number>;
	className?: string;
}) {
	const desk = useTransform(scene, (v) => Math.max(0, v));
	const photoOpacity = useTransform(scene, [-0.85, -0.3], [1, 0]);
	const photoScale = useTransform(scene, [-1, -0.3], [1, 0.85]);
	const photoBlur = useTransform(scene, [-1, -0.3], ['blur(0px)', 'blur(8px)']);
	const deskReveal = useTransform(
		scene,
		[-0.8, 0],
		['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'],
	);

	return (
		<div className={`relative ${className}`}>
			<motion.div
				aria-hidden='true'
				className='w-full'
				style={{ clipPath: deskReveal }}
			>
				<DeskScene phases={phases} p={desk} />
			</motion.div>
			<motion.div
				style={{ opacity: photoOpacity, scale: photoScale, filter: photoBlur }}
				className='pointer-events-none absolute inset-0 flex items-center justify-center'
			>
				<Image
					src={avatar}
					alt={title}
					width={640}
					height={640}
					priority
					sizes='(min-width: 768px) 28rem, 30svh'
					className='aspect-square h-[92%] w-auto rounded-(--ds-radius-lg) object-cover'
				/>
			</motion.div>
		</div>
	);
}
