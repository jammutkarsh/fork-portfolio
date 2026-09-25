import type React from 'react';
import SiteNav from './site-nav';

export default function PageContainer({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex w-full flex-col items-center justify-center'>
			<SiteNav />
			<main className='flex min-h-[calc(100svh-4rem)] w-full max-w-5xl flex-col gap-4 border-gray-200 dark:border-gray-300/20 p-8 pt-12 md:p-18 md:pt-14 border-x'>
				{children}
			</main>
		</div>
	);
}
