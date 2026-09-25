'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ViewTransition } from 'react';
import { merryWeather } from '../../fonts';
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
			{/*
				One set of links (the active indicator is a named view transition and
				must be unique). Below `sm` the links wrap onto a second row.
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
				<div className='order-3 -mx-5 flex h-11 w-[calc(100%+2.5rem)] items-center gap-5 overflow-x-auto border-t border-gray-200 px-5 text-sm dark:border-gray-300/20 sm:order-2 sm:mx-0 sm:mr-4 sm:ml-auto sm:h-auto sm:w-auto sm:gap-6 sm:overflow-visible sm:border-0 sm:px-0 sm:text-base'>
					{navLinks.map(({ href, title }) => {
						const isActive =
							pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Link
								key={href}
								href={href}
								aria-current={isActive ? 'page' : undefined}
								className={classNames(
									'relative shrink-0 py-1 motion-safe:transition-colors motion-safe:duration-200',
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
										<span className='absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-500' />
									</ViewTransition>
								)}
							</Link>
						);
					})}
				</div>
				<div className='order-2 ml-auto flex items-center sm:order-3 sm:ml-0'>
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
			</nav>
		</header>
	);
}
