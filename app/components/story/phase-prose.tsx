import type { ComponentPropsWithoutRef } from 'react';
import { CustomMDX } from '../mdx';

/** Renders one phase's markdown with tighter paragraphs than a blog post. */
export default function PhaseProse({ source }: { source: string }) {
	return (
		<CustomMDX
			source={source}
			components={{
				p: (props: ComponentPropsWithoutRef<'p'>) => (
					<p
						className='py-1.5 leading-relaxed text-gray-800 dark:text-gray-200'
						{...props}
					/>
				),
			}}
		/>
	);
}
