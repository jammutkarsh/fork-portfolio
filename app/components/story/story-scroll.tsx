'use client';

import {
	MotionConfig,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from 'motion/react';
import { type ReactNode, useEffect, useState } from 'react';
import { animateFrame, useFrame } from '../layouts/frame';
import type { PhaseMeta } from './get-story';
import StoryColumns from './story-columns';
import StoryPinned from './story-pinned';
import Thesis from './thesis';
import WorldBackdrop from './world-backdrop';

// Phones held upright get the pinned layout; see .story-* in site.css.
const PORTRAIT = '(max-width: 767px) and (min-height: 501px)';

/** Whether the screen is a phone held upright; undefined until known. */
function usePortrait() {
	const [portrait, setPortrait] = useState<boolean>();
	useEffect(() => {
		const media = window.matchMedia(PORTRAIT);
		const update = () => setPortrait(media.matches);
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	}, []);
	return portrait;
}

/**
 * Turns the reader's raw position between two chapters into the scene's:
 * the scene holds still while a chapter is on and moves on in between, so
 * it never sits half-way while you read.
 */
function settle(pos: number) {
	const base = Math.floor(pos);
	const t = Math.min(1, Math.max(0, (pos - base - 0.2) / 0.6));
	return base + t * t * (3 - 2 * t);
}

/**
 * The home page as a scrolled story. The page scrolls freely (nothing snaps
 * or holds the scroll); everything else follows how far you've scrolled.
 *
 * My photo dissolves into my desk, and the desk changes with each phase of
 * the story while its chapters go by; behind it all the world changes
 * colour per phase. The story ends on the thesis every phase leads back to.
 *
 * Wide screens read the chapters down a column beside the desk
 * (StoryColumns); phones held upright keep one pinned frame whose title,
 * desk and text move along with the scroll (StoryPinned). Until the screen
 * is known both are rendered and CSS shows the right one.
 */
export default function StoryScroll({
	title,
	bio,
	avatar,
	thesis,
	closing,
	phases,
	prose,
	sentences,
}: {
	title: string;
	bio: string;
	avatar: string;
	thesis: string;
	closing: string;
	phases: PhaseMeta[];
	prose: ReactNode[];
	/** Each phase's prose, one sentence at a time. */
	sentences: ReactNode[][];
}) {
	const reduceMotion = useReducedMotion();
	const portrait = usePortrait();

	// Where the reader is: -1 on the intro, then 0 … phases - 1 as each
	// chapter comes on, fractions in between. Set by the layout on screen.
	const pos = useMotionValue(-1);

	const settled = useTransform(pos, settle);
	const smooth = useSpring(settled, { stiffness: 140, damping: 26, mass: 0.6 });
	const scene = reduceMotion ? settled : smooth;

	// The home page opens the frame: its lines slide off screen and the nav
	// widens to the story's width; leaving the page closes it again.
	const { open, wide } = useFrame();
	useEffect(() => {
		for (const value of [open, wide]) {
			if (reduceMotion) value.set(1);
			else animateFrame(value, 1);
		}
		return () => {
			for (const value of [open, wide]) {
				if (reduceMotion) value.set(0);
				else animateFrame(value, 0);
			}
		};
	}, [open, wide, reduceMotion]);

	const story = { title, bio, avatar, phases, prose, pos, scene };

	return (
		<MotionConfig reducedMotion='user'>
			<WorldBackdrop p={scene} phases={phases} />

			{portrait !== true && (
				<div className={portrait === undefined ? 'story-wide' : undefined}>
					<StoryColumns {...story} active={portrait === false} />
				</div>
			)}
			{portrait !== false && (
				<div className={portrait === undefined ? 'story-portrait' : undefined}>
					<StoryPinned
						{...story}
						sentences={sentences}
						active={portrait === true}
					/>
				</div>
			)}

			<Thesis
				thesis={thesis}
				closing={closing}
				thread={portrait === false ? phases.at(-1)?.color : undefined}
			/>
		</MotionConfig>
	);
}
