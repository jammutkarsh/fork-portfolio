'use client';

import classNames from 'classnames';
import { MotionConfig } from 'motion/react';
import Link from 'next/link';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { merryWeather } from '../../fonts';
import DeskScene from './desk-scene';
import type { PhaseMeta } from './get-story';

/**
 * The story as "the desk over time": the phases scroll by on one side while
 * a pinned illustration of the desk changes to match the phase in view. On
 * small screens the desk pins above the text instead.
 */
export default function DeskStory({
	phases,
	prose,
}: {
	phases: PhaseMeta[];
	prose: ReactNode[];
}) {
	const [active, setActive] = useState(0);
	const blocks = useRef<(HTMLElement | null)[]>([]);

	// A phase becomes active when it crosses a thin band a little below the
	// middle of the viewport (below the pinned desk on small screens).
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActive(blocks.current.indexOf(entry.target as HTMLElement));
					}
				}
			},
			{ rootMargin: '-55% 0px -40% 0px' },
		);
		for (const block of blocks.current) if (block) observer.observe(block);
		return () => observer.disconnect();
	}, []);

	const last = phases.length - 1;

	return (
		<MotionConfig reducedMotion='user'>
			<div className='grid gap-x-12 md:grid-cols-[1fr_1.15fr]'>
				<div
					aria-hidden='true'
					className='sticky top-14 z-10 -mx-8 bg-white px-8 pt-2 pb-4 sm:top-16 md:order-2 md:mx-0 md:flex md:h-[calc(100svh-4rem)] md:flex-col md:justify-center md:px-0 md:pb-0 dark:bg-black'
				>
					<DeskScene phases={phases} active={active} />
					<p className='mt-3 font-mono text-xs text-gray-500'>
						Goal:{' '}
						<span className='text-primary-500'>{phases[active].goal}</span>
					</p>
				</div>

				<ol className='md:order-1'>
					{phases.map((phase, index) => (
						<li
							key={phase.id}
							ref={(el) => {
								blocks.current[index] = el;
							}}
							className={classNames(
								'flex flex-col justify-center py-12 transition-opacity duration-500 md:min-h-[80svh]',
								index === active ? 'opacity-100' : 'opacity-35',
							)}
						>
							<p className='font-mono text-xs uppercase tracking-widest text-gray-500'>
								Phase {String(index + 1).padStart(2, '0')} ·{' '}
								{phases.slice(0, index).map((past) => (
									<span key={past.id}>
										<s className='decoration-primary-500'>{past.goal}</s>
										{' → '}
									</span>
								))}
								<span className='text-primary-500'>{phase.goal}</span>
							</p>
							<h3
								className={classNames(
									'mt-2 mb-2 text-2xl font-bold md:text-3xl',
									merryWeather.className,
								)}
							>
								{phase.title}
							</h3>
							{prose[index]}
							{index === last && (
								<div className='mt-4 flex gap-5'>
									<Link href='/blog' className='underline-magical'>
										Read the blog &rarr;
									</Link>
									<Link href='/projects' className='underline-magical'>
										See projects &rarr;
									</Link>
								</div>
							)}
						</li>
					))}
				</ol>
			</div>
		</MotionConfig>
	);
}
