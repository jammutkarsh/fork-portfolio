import classNames from 'classnames';
import type { ReactNode } from 'react';
import type { Phase } from './get-story';
import { Sticker } from './stickers';

/**
 * The story as a plain list of phases. It is what small screens, reduced
 * motion and screen readers get, and what the page renders before the
 * interactive version takes over.
 */
export default function StoryList({
	phases,
	prose,
	className,
}: {
	phases: Phase[];
	/** Rendered body of each phase, same order as `phases`. */
	prose: ReactNode[];
	className?: string;
}) {
	return (
		<ol className={classNames('space-y-16', className)}>
			{phases.map((phase, index) => (
				<li key={phase.id} className='space-y-4'>
					<div aria-hidden='true' className='flex gap-3'>
						{phase.stickers.map((id, i) => (
							<Sticker
								key={id}
								id={id}
								className={classNames(
									'size-16 sm:size-20',
									i % 2 ? 'rotate-6' : '-rotate-6',
								)}
							/>
						))}
					</div>
					<p className='font-mono text-xs uppercase tracking-widest text-gray-500'>
						Phase {String(index + 1).padStart(2, '0')}
					</p>
					<h3 className='text-2xl font-bold md:text-3xl'>{phase.title}</h3>
					<p className='text-sm text-gray-600 dark:text-gray-400'>
						Goal:{' '}
						{phases.slice(0, index).map((past) => (
							<span key={past.id}>
								<s className='decoration-primary-500 decoration-2'>
									{past.goal}
								</s>
								{' → '}
							</span>
						))}
						<strong className='text-primary-500'>{phase.goal}</strong>
					</p>
					<div>{prose[index]}</div>
				</li>
			))}
		</ol>
	);
}
