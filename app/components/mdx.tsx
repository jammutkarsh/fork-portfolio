import { getTextContent, slugify } from 'app/blog/[slug]/extract-headings';
import Link from 'next/link';
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import type { ComponentPropsWithoutRef } from 'react';

type HeadingProps = ComponentPropsWithoutRef<'h2'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;

/*
  MDX elements are styled by the utc-ds design system: render MDX inside a
  `.ds-prose` element (app/utc-ds.css). The components here only add
  behaviour: heading ids for the table of contents, and internal links
  through next/link.
*/
export const components = {
	h2: ({ children, ...props }: HeadingProps) => (
		<h2
			id={slugify(getTextContent(children))}
			className='scroll-mt-20'
			{...props}
		>
			{children}
		</h2>
	),
	h3: ({ children, ...props }: HeadingProps) => (
		<h3
			id={slugify(getTextContent(children))}
			className='scroll-mt-20'
			{...props}
		>
			{children}
		</h3>
	),
	a: ({ href, children, ...props }: AnchorProps) => {
		if (href?.startsWith('/')) {
			return (
				<Link href={href} {...props}>
					{children}
				</Link>
			);
		}
		if (href?.startsWith('#')) {
			return (
				<a href={href} {...props}>
					{children}
				</a>
			);
		}
		return (
			<a href={href} target='_blank' rel='noopener noreferrer' {...props}>
				{children}
			</a>
		);
	},
};

export function CustomMDX(props: MDXRemoteProps) {
	return (
		<MDXRemote
			{...props}
			components={{ ...components, ...(props.components || {}) }}
		/>
	);
}
