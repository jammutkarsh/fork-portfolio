'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, ViewTransition } from 'react';
import { merryWeather } from '../../fonts';
import { openCommandMenu } from '../command-menu';
import ThemeSwitch from './theme-switch/theme-switch';

export const navLinks = [
	{ href: '/blog', title: 'Blog' },
	{ href: '/projects', title: 'Projects' },
	{ href: '/uses', title: 'Uses' },
];

const MOBILE_QUERY = '(max-width: 639px)';

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden='true'
		>
			<circle cx='11' cy='11' r='7' />
			<path d='m20 20-3.5-3.5' />
		</svg>
	);
}

export default function SiteNav() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(MOBILE_QUERY);
		const update = () => {
			setIsMobile(media.matches);
			if (!media.matches) setOpen(false);
		};
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	}, []);

	// Close the mobile menu on navigation and on Escape.
	// biome-ignore lint/correctness/useExhaustiveDependencies: runs on route change
	useEffect(() => setOpen(false), [pathname]);
	useEffect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [open]);

	return (
		<header className='sticky top-0 z-20 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-300/20 dark:bg-black/80'>
			{/*
				The links are rendered once (the active indicator is a named view
				transition and must be unique): inline on desktop, inside the
				collapsible hamburger panel on mobile.
			*/}
			<nav className='mx-auto flex w-full max-w-5xl flex-wrap items-center border-x border-gray-200 px-5 dark:border-gray-300/20 sm:h-16 sm:flex-nowrap sm:px-8 md:px-18'>
				<Link
					href='/'
					aria-label='Home'
					className={classNames(
						'order-1 flex h-14 items-center text-lg font-bold sm:h-auto',
						merryWeather.className,
					)}
				>
					UC
				</Link>

				{/* Mobile: hamburger toggle */}
				<button
					type='button'
					onClick={() => setOpen((value) => !value)}
					aria-expanded={open}
					aria-controls='site-nav-menu'
					aria-label={open ? 'Close menu' : 'Open menu'}
					className='order-2 -mr-2 ml-auto flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 sm:hidden'
				>
					<span
						className={classNames(
							'h-0.5 w-5 rounded-full bg-current motion-safe:transition-transform motion-safe:duration-300',
							open && 'translate-y-2 rotate-45',
						)}
					/>
					<span
						className={classNames(
							'h-0.5 w-5 rounded-full bg-current motion-safe:transition-opacity motion-safe:duration-200',
							open && 'opacity-0',
						)}
					/>
					<span
						className={classNames(
							'h-0.5 w-5 rounded-full bg-current motion-safe:transition-transform motion-safe:duration-300',
							open && '-translate-y-2 -rotate-45',
						)}
					/>
				</button>

				{/* Links: collapsible panel on mobile, inline row on desktop */}
				<div
					id='site-nav-menu'
					inert={isMobile && !open ? true : undefined}
					className={classNames(
						'order-3 grid w-full motion-safe:transition-[grid-template-rows] motion-safe:duration-300 sm:order-2 sm:mr-4 sm:ml-auto sm:flex sm:w-auto',
						open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
					)}
				>
					<div className='min-h-0 overflow-hidden sm:overflow-visible'>
						<div className='flex flex-col items-start gap-1 pt-1 pb-4 text-base sm:flex-row sm:items-center sm:gap-6 sm:p-0'>
							{navLinks.map(({ href, title }) => {
								const isActive =
									pathname === href || pathname.startsWith(`${href}/`);
								return (
									<Link
										key={href}
										href={href}
										aria-current={isActive ? 'page' : undefined}
										className={classNames(
											'relative py-2 motion-safe:transition-colors motion-safe:duration-200 sm:py-1',
											isActive
												? 'text-black dark:text-white'
												: 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white',
										)}
									>
										{title}
										{isActive && (
											// Named view transition: on navigation the browser morphs
											// this bar from the previous link to the new one.
											<ViewTransition
												name='nav-indicator'
												share='nav-indicator'
												default='none'
											>
												<span className='absolute inset-x-0 bottom-1 h-0.5 rounded-full bg-primary-500 sm:bottom-0' />
											</ViewTransition>
										)}
									</Link>
								);
							})}

							{/* Mobile-only: search and theme inside the menu */}
							<div className='mt-2 flex w-full items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-300/20 sm:hidden'>
								<button
									type='button'
									onClick={() => {
										setOpen(false);
										openCommandMenu();
									}}
									className='-ml-1 flex cursor-pointer items-center gap-2 py-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
								>
									<SearchIcon className='h-5 w-5' />
									Search
								</button>
								<ThemeSwitch className='-mr-2 flex items-center' />
							</div>
						</div>
					</div>
				</div>

				{/* Desktop: ⌘K and theme */}
				<div className='order-3 hidden items-center sm:flex'>
					<button
						type='button'
						onClick={openCommandMenu}
						aria-label='Open command menu'
						className='cursor-pointer rounded-md border border-gray-300 px-2 py-0.5 text-xs text-gray-600 hover:text-black dark:border-gray-700 dark:text-gray-400 dark:hover:text-white'
					>
						<kbd className='font-sans'>⌘K</kbd>
					</button>
					<ThemeSwitch className='-mr-2 flex items-center' />
				</div>
			</nav>
		</header>
	);
}
