import type { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default function PageTitle({ children }: Props) {
	return (
		<h1 className='text-3xl leading-tight font-light tracking-[-0.04em] text-(--ds-text-primary) sm:text-5xl'>
			{children}
		</h1>
	);
}
