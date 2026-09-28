import type React from 'react';
import { PageAmbience } from './ambience';

export default function PageContainer({
	children,
	className,
	accent = '#af00d7',
}: {
	children: React.ReactNode;
	className?: string;
	/** The colour the background glow moves to as the page scrolls. */
	accent?: string;
}) {
	return (
		<main
			className={`mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 border-x border-gray-200 p-8 pt-12 dark:border-gray-300/20 md:p-18 md:pt-14 ${className ?? ''}`}
		>
			<PageAmbience accent={accent} />
			{children}
		</main>
	);
}
