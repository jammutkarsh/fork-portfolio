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
				// Mermaid sizes the boxes by measuring the labels, so it needs the
				// real font name (next/font's JetBrains Mono), not 'inherit'.
				fontFamily:
					getComputedStyle(document.documentElement)
						.getPropertyValue('--font-jetbrains-mono')
						.trim() || 'monospace',
				themeVariables: {
					darkMode: dark,
					background: 'transparent',
					// utc-ds tokens (app/utc-ds.css) for each theme
					primaryColor: dark ? '#111111' : '#f0f0f0',
					primaryTextColor: dark ? '#e8e8e8' : '#1a1a1a',
					primaryBorderColor: dark ? '#333333' : '#cccccc',
					lineColor: '#ff5f00',
					secondaryColor: dark ? '#1a1a1a' : '#e6e6e6',
					tertiaryColor: dark ? '#1a1a1a' : '#e6e6e6',
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
			<pre className='overflow-x-auto rounded-(--ds-radius) border border-(--ds-border) bg-(--ds-bg-code) p-4 font-mono text-sm'>
				{source}
			</pre>
		);
	}
	return (
		<div
			className='flex justify-center overflow-x-auto font-mono text-sm [&_svg]:h-auto [&_svg]:max-w-full'
			// biome-ignore lint/security/noDangerouslySetInnerHtml: SVG produced by Mermaid from repo content, with securityLevel 'strict'
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}
