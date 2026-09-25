'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ViewTransition } from 'react';
import { merryWeather } from '../../fonts';
import siteMetadata from '../../site-metadata';
import { openCommandMenu } from '../command-menu';
import ThemeSwitch from './theme-switch/theme-switch';

export const navLinks = [
	{ href: '/blog', title: 'Blog' },
	{ href: '/projects', title: 'Projects' },
	{ href: '/about', title: 'About' },
	{ href: '/uses', title: 'Uses' },
];

export default function SiteNav() {
	const pathname = usePathname();

	return (
		<header className='sticky top-0 z-20 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-300/20 dark:bg-black/80'>
			<nav className='mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 border-x border-gray-200 px-5 dark:border-gray-300/20 sm:px-8 md:px-18'>
				<Link
					href='/'
					className={classNames(
						'shrink-0 text-lg font-bold',
						merryWeather.className,
					)}
				>
					<span className='hidden sm:inline'>{siteMetadata.title}</span>
					<span className='sm:hidden'>UC</span>
				</Link>
				<div className='flex items-center gap-3 text-sm sm:gap-6 sm:text-base'>
					{navLinks.map(({ href, title }) => {
						const isActive =
							pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Link
								key={href}
								href={href}
								aria-current={isActive ? 'page' : undefined}
								className={classNames(
									'relative py-1 motion-safe:transition-colors motion-safe:duration-200',
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
										<span className='absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary-500' />
									</ViewTransition>
								)}
							</Link>
						);
					})}
					<div className='flex items-center'>
						<button
							type='button'
							onClick={openCommandMenu}
							aria-label='Open command menu'
							className='flex cursor-pointer items-center gap-1 rounded-md p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white sm:border sm:border-gray-300 sm:px-2 sm:py-0.5 sm:text-xs dark:sm:border-gray-700'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='h-5 w-5 sm:hidden'
								aria-hidden='true'
							>
								<circle cx='11' cy='11' r='7' />
								<path d='m20 20-3.5-3.5' />
							</svg>
							<kbd className='hidden font-sans sm:inline'>⌘K</kbd>
						</button>
						<ThemeSwitch className='-mr-2 flex items-center' />
					</div>
				</div>
			</nav>
		</header>
	);
}
