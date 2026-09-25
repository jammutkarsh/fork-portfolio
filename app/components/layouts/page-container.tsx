import type React from 'react';

export default function PageContainer({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<main
			className={`mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 border-x border-gray-200 p-8 pt-12 dark:border-gray-300/20 md:p-18 md:pt-14 ${className ?? ''}`}
		>
			{children}
		</main>
	);
}
