'use client';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { type MouseEvent, useEffect, useState } from 'react';
import { MoonIcon } from '../icons/moon-icon';
import { SunMediumIcon } from '../icons/sun-icon';
import { switchTheme } from './switch-theme';

const ThemeSwitch = ({
	className = 'flex items-center',
}: {
	className?: string;
}) => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme, resolvedTheme } = useTheme();

	// When mounted on client, now we can show the UI
	useEffect(() => setMounted(true), []);

	const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
		const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
		const rect = event.currentTarget.getBoundingClientRect();
		switchTheme(() => setTheme(newTheme), {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		});
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
