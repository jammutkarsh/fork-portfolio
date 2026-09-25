'use client';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { MoonIcon } from '../icons/moon-icon';
import { SunMediumIcon } from '../icons/sun-icon';

const ThemeSwitch = ({
	className = 'flex items-center',
}: {
	className?: string;
}) => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme, resolvedTheme } = useTheme();

	// When mounted on client, now we can show the UI
	useEffect(() => setMounted(true), []);

	const toggleTheme = () => {
		const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

		// Use ViewTransition API if supported, otherwise fallback to immediate switch
		if (typeof document !== 'undefined' && 'startViewTransition' in document) {
			const root = document.documentElement;
			root.classList.add('theme-switching');
			const transition = document.startViewTransition(() => {
				setTheme(newTheme);
			});
			transition.finished.finally(() => {
				root.classList.remove('theme-switching');
			});
		} else {
			setTheme(newTheme);
		}
	};

	return (
		<div className={className}>
			<motion.button
				aria-label='Toggle Dark Mode'
				type='button'
				whileTap={{
					scale: 0.95,
					rotate: 360,
					transition: { duration: 0.2 },
				}}
				whileHover={{ scale: 1.1 }}
				onClick={toggleTheme}
			>
				{mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
					<SunMediumIcon className='h-9 w-9' />
				) : (
					<MoonIcon className='h-9 w-9' />
				)}
			</motion.button>
		</div>
	);
};

export default ThemeSwitch;
