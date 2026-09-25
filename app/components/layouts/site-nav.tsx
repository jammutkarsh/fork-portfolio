'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { merryWeather } from '../../fonts';
import siteMetadata from '../../site-metadata';
import ThemeSwitch from './theme-switch/theme-switch';

const links = [
	{ href: '/blog', title: 'Blog' },
	{ href: '/projects', title: 'Projects' },
	{ href: '/about', title: 'About' },
	{ href: '/uses', title: 'Uses' },
];

export default function SiteNav() {
	const pathname = usePathname();

	return (
		<header className='sticky top-0 z-20 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-300/20 dark:bg-black/80'>
			<nav className='mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 border-x border-gray-200 px-8 dark:border-gray-300/20 md:px-18'>
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
				<div className='flex items-center gap-4 text-sm sm:gap-6 sm:text-base'>
					{links.map(({ href, title }) => {
						const isActive =
							pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Link
								key={href}
								href={href}
								aria-current={isActive ? 'page' : undefined}
								className={classNames(
									'border-b-2 py-1 motion-safe:transition-colors motion-safe:duration-200',
									isActive
										? 'border-primary-500 text-black dark:text-white'
										: 'border-transparent text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white',
								)}
							>
								{title}
							</Link>
						);
					})}
					<ThemeSwitch className='-mr-2 flex items-center' />
				</div>
			</nav>
		</header>
	);
}
