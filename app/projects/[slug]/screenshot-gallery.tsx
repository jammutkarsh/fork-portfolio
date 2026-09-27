'use client';

import { useLenis } from 'lenis/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Screenshot } from '../types';

const control =
	'flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20';

/**
 * Screenshot thumbnails; clicking one opens a full-screen preview (a native
 * <dialog>) with previous/next, arrow keys, Esc to close and a link to the
 * original file.
 */
export default function ScreenshotGallery({
	screenshots,
}: {
	screenshots: Screenshot[];
}) {
	const dialog = useRef<HTMLDialogElement>(null);
	const [index, setIndex] = useState(0);
	const lenis = useLenis();
	const count = screenshots.length;
	const current = screenshots[index];

	const open = (i: number) => {
		setIndex(i);
		dialog.current?.showModal();
		lenis?.stop();
	};
	const step = (by: number) => setIndex((i) => (i + by + count) % count);

	return (
		<>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{screenshots.map((shot, i) => (
					<figure key={shot.src} className='space-y-2'>
						<button
							type='button'
							onClick={() => open(i)}
							className='relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-lg border border-gray-200 dark:border-gray-300/20'
							aria-label={`Open screenshot: ${shot.caption ?? shot.src}`}
						>
							<Image
								src={shot.src}
								alt={shot.caption ?? ''}
								fill
								sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
								className='object-cover object-top transition-transform duration-500 hover:scale-105'
							/>
						</button>
						{shot.caption && (
							<figcaption className='text-sm text-gray-500'>
								{shot.caption}
							</figcaption>
						)}
					</figure>
				))}
			</div>

			<dialog
				ref={dialog}
				onClose={() => lenis?.start()}
				onClick={(event) => {
					if (event.target === event.currentTarget) dialog.current?.close();
				}}
				onKeyDown={(event) => {
					if (event.key === 'ArrowRight') step(1);
					if (event.key === 'ArrowLeft') step(-1);
				}}
				className='m-auto h-dvh max-h-none w-dvw max-w-none bg-transparent p-4 backdrop:bg-black/95 backdrop:backdrop-blur-sm md:p-10'
			>
				<div className='pointer-events-none flex h-full flex-col gap-4'>
					<div className='pointer-events-auto flex items-center justify-between gap-4 text-sm text-gray-300'>
						<span className='tabular-nums'>
							{index + 1} / {count}
							{current.caption && ` · ${current.caption}`}
						</span>
						<div className='flex items-center gap-2'>
							<a
								href={current.src}
								target='_blank'
								rel='noreferrer'
								className='rounded-full px-3 py-2 hover:bg-white/10'
							>
								Open original ↗
							</a>
							<button
								type='button'
								onClick={() => dialog.current?.close()}
								className={control}
								aria-label='Close'
							>
								✕
							</button>
						</div>
					</div>
					<div className='relative min-h-0 flex-1'>
						<Image
							src={current.src}
							alt={current.caption ?? ''}
							fill
							sizes='100vw'
							className='pointer-events-auto object-contain'
						/>
					</div>
					{count > 1 && (
						<div className='pointer-events-auto flex justify-center gap-3'>
							<button
								type='button'
								onClick={() => step(-1)}
								className={control}
								aria-label='Previous screenshot'
							>
								←
							</button>
							<button
								type='button'
								onClick={() => step(1)}
								className={control}
								aria-label='Next screenshot'
							>
								→
							</button>
						</div>
					)}
				</div>
			</dialog>
		</>
	);
}
