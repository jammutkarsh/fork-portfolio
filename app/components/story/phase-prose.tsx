import type { ComponentPropsWithoutRef } from 'react';
import { CustomMDX } from '../mdx';

/**
 * Renders one phase's markdown with tighter paragraphs than a blog post.
 * `inline` renders it as running text instead (no paragraph), for placing
 * single sentences side by side.
 */
export default function PhaseProse({
	source,
	inline = false,
}: {
	source: string;
	inline?: boolean;
}) {
	return (
		<CustomMDX
			source={source}
			components={{
				p: inline
					? ({ children }: ComponentPropsWithoutRef<'p'>) => <>{children}</>
					: (props: ComponentPropsWithoutRef<'p'>) => (
							<p
								className='py-1.5 leading-relaxed text-(--ds-text-primary)'
								{...props}
							/>
						),
			}}
		/>
	);
}
