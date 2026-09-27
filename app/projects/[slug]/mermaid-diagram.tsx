'use client';

import { useTheme } from 'next-themes';
import { useEffect, useId, useState } from 'react';

/**
 * Renders Mermaid source as an SVG diagram in the site's colours, redrawn
 * when the theme changes. Until it has rendered (or without JavaScript)
 * the source is shown instead.
 */
export default function MermaidDiagram({ source }: { source: string }) {
	const { resolvedTheme } = useTheme();
	const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
	const [svg, setSvg] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		const dark = resolvedTheme === 'dark';
		import('mermaid').then(async ({ default: mermaid }) => {
			mermaid.initialize({
				startOnLoad: false,
				securityLevel: 'strict',
				theme: 'base',
				fontFamily: 'inherit',
				themeVariables: {
					darkMode: dark,
					background: 'transparent',
					primaryColor: dark ? '#000000' : '#ffffff',
					primaryTextColor: dark ? '#f3f4f6' : '#111827',
					primaryBorderColor: dark ? '#f3f4f6' : '#111827',
					lineColor: '#de1d8d',
					secondaryColor: dark ? '#111827' : '#f3f4f6',
					tertiaryColor: dark ? '#111827' : '#f3f4f6',
				},
			});
			try {
				const { svg } = await mermaid.render(id, source);
				if (!cancelled) setSvg(svg);
			} catch {
				if (!cancelled) setSvg(null);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [id, source, resolvedTheme]);

	if (!svg) {
		return (
			<pre className='overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-900'>
				{source}
			</pre>
		);
	}
	return (
		<div
			className='flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full'
			// biome-ignore lint/security/noDangerouslySetInnerHtml: SVG produced by Mermaid from repo content, with securityLevel 'strict'
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}
