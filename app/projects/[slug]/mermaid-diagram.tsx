'use client';

import { useLenis } from 'lenis/react';
import { useTheme } from 'next-themes';
import {
	type PointerEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';

/**
 * Renders Mermaid source (any diagram type) as an SVG in the site's
 * colours, redrawn when the theme changes, inside a viewer you can pan and
 * zoom, or open full screen. Until it has rendered (or without JavaScript)
 * the source is shown instead.
 */
export default function MermaidDiagram({ source }: { source: string }) {
	const { resolvedTheme } = useTheme();
	const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
	const [svg, setSvg] = useState<string | null>(null);
	const dialog = useRef<HTMLDialogElement>(null);
	const [expanded, setExpanded] = useState(false);
	const lenis = useLenis();

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

	const open = () => {
		setExpanded(true);
		dialog.current?.showModal();
		lenis?.stop();
	};

	return (
		<>
			<Viewer svg={svg} className='h-[min(70svh,32rem)]' onExpand={open} />
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: the dialog closes on Esc natively */}
			<dialog
				ref={dialog}
				onClose={() => {
					setExpanded(false);
					lenis?.start();
				}}
				// Clicking outside the diagram's box closes it (Esc closes it too).
				onClick={(event) => {
					if (event.target === event.currentTarget) dialog.current?.close();
				}}
				className='m-auto h-dvh max-h-none w-dvw max-w-none bg-transparent p-4 backdrop:bg-black/90 backdrop:backdrop-blur-sm md:p-10'
			>
				{expanded && (
					<Viewer
						svg={svg}
						className='h-full'
						onClose={() => dialog.current?.close()}
					/>
				)}
			</dialog>
		</>
	);
}

const STEP = 80;
const ZOOM = 1.25;

interface View {
	x: number;
	y: number;
	scale: number;
}

/**
 * The diagram in a box you can pan (drag, or the arrows) and zoom (the
 * buttons, or ctrl/⌘ + scroll), with a button to reset it to fit.
 */
function Viewer({
	svg,
	className,
	onExpand,
	onClose,
}: {
	svg: string;
	className: string;
	onExpand?: () => void;
	onClose?: () => void;
}) {
	const box = useRef<HTMLDivElement>(null);
	const content = useRef<HTMLDivElement>(null);
	const size = useRef({ width: 1, height: 1 });
	const drag = useRef<{ x: number; y: number } | null>(null);
	const [view, setView] = useState<View>({ x: 0, y: 0, scale: 1 });
	const [animate, setAnimate] = useState(false);

	// The view that fits the whole diagram in the box, centred.
	const fit = useCallback((): View => {
		const b = box.current;
		if (!b) return { x: 0, y: 0, scale: 1 };
		const { width, height } = size.current;
		const pad = 24;
		const scale = Math.min(
			(b.clientWidth - pad * 2) / width,
			(b.clientHeight - pad * 2) / height,
			2,
		);
		return {
			scale,
			x: (b.clientWidth - width * scale) / 2,
			y: (b.clientHeight - height * scale) / 2,
		};
	}, []);

	// Show the SVG at its own size (the viewer scales it), then fit it.
	// biome-ignore lint/correctness/useExhaustiveDependencies: runs again for each new SVG
	useEffect(() => {
		const el = content.current?.querySelector('svg');
		if (!el) return;
		const { width, height } = el.viewBox.baseVal;
		size.current = { width: width || 1, height: height || 1 };
		el.setAttribute('width', String(size.current.width));
		el.setAttribute('height', String(size.current.height));
		el.style.maxWidth = 'none';
		setView(fit());
		const resize = new ResizeObserver(() => setView(fit()));
		if (box.current) resize.observe(box.current);
		return () => resize.disconnect();
	}, [svg, fit]);

	const move = (dx: number, dy: number) => {
		setAnimate(true);
		setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
	};
	// Zoom by `by` around a point in the box (its centre by default).
	const zoom = (by: number, at?: { x: number; y: number }) => {
		const b = box.current;
		if (!b) return;
		const px = at?.x ?? b.clientWidth / 2;
		const py = at?.y ?? b.clientHeight / 2;
		setView((v) => {
			const scale = Math.min(8, Math.max(0.1, v.scale * by));
			const k = scale / v.scale;
			return { scale, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
		});
	};

	// ctrl/⌘ + scroll zooms; a plain scroll keeps scrolling the page.
	useEffect(() => {
		const b = box.current;
		if (!b) return;
		const onWheel = (event: WheelEvent) => {
			if (!event.ctrlKey && !event.metaKey) return;
			event.preventDefault();
			const r = b.getBoundingClientRect();
			setAnimate(false);
			zoom(Math.exp(-event.deltaY * 0.002), {
				x: event.clientX - r.left,
				y: event.clientY - r.top,
			});
		};
		b.addEventListener('wheel', onWheel, { passive: false });
		return () => b.removeEventListener('wheel', onWheel);
	});

	const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if ((event.target as HTMLElement).closest('button')) return;
		drag.current = { x: event.clientX, y: event.clientY };
		event.currentTarget.setPointerCapture(event.pointerId);
		setAnimate(false);
	};
	const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const from = drag.current;
		if (!from) return;
		const dx = event.clientX - from.x;
		const dy = event.clientY - from.y;
		drag.current = { x: event.clientX, y: event.clientY };
		setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
	};
	const onPointerUp = () => {
		drag.current = null;
	};

	return (
		<div
			ref={box}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
			className={`relative cursor-grab touch-pan-y overflow-hidden rounded-(--ds-radius-lg) border border-(--ds-border) bg-(--ds-bg-code) select-none active:cursor-grabbing ${className}`}
		>
			<div
				ref={content}
				className='absolute top-0 left-0 origin-top-left font-mono text-sm'
				style={{
					transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
					transition: animate ? 'transform 200ms ease-out' : undefined,
				}}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: SVG produced by Mermaid from repo content, with securityLevel 'strict'
				dangerouslySetInnerHTML={{ __html: svg }}
			/>

			{/* Expand / close, top right */}
			<div className='absolute top-3 right-3'>
				{onExpand && (
					<Control label='Open full screen' onClick={onExpand}>
						<path d='M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7' />
					</Control>
				)}
				{onClose && (
					<Control label='Close' onClick={onClose}>
						<path d='M18 6 6 18M6 6l12 12' />
					</Control>
				)}
			</div>

			{/* Pan and zoom, bottom right (like GitHub's diagram viewer) */}
			<div className='absolute right-3 bottom-3 grid grid-cols-3 gap-1'>
				<span />
				<Control label='Pan up' onClick={() => move(0, STEP)}>
					<path d='m18 15-6-6-6 6' />
				</Control>
				<Control
					label='Zoom in'
					onClick={() => {
						setAnimate(true);
						zoom(ZOOM);
					}}
				>
					<circle cx='11' cy='11' r='7' />
					<path d='m20 20-3.5-3.5M11 8v6M8 11h6' />
				</Control>
				<Control label='Pan left' onClick={() => move(STEP, 0)}>
					<path d='m15 18-6-6 6-6' />
				</Control>
				<Control
					label='Reset view'
					onClick={() => {
						setAnimate(true);
						setView(fit());
					}}
				>
					<path d='M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5' />
				</Control>
				<Control label='Pan right' onClick={() => move(-STEP, 0)}>
					<path d='m9 18 6-6-6-6' />
				</Control>
				<span />
				<Control label='Pan down' onClick={() => move(0, -STEP)}>
					<path d='m6 9 6 6 6-6' />
				</Control>
				<Control
					label='Zoom out'
					onClick={() => {
						setAnimate(true);
						zoom(1 / ZOOM);
					}}
				>
					<circle cx='11' cy='11' r='7' />
					<path d='m20 20-3.5-3.5M8 11h6' />
				</Control>
			</div>
		</div>
	);
}

function Control({
	label,
	onClick,
	children,
}: {
	label: string;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type='button'
			aria-label={label}
			title={label}
			onClick={onClick}
			className='flex size-9 cursor-pointer items-center justify-center rounded-(--ds-radius-lg) border border-(--ds-border-strong) bg-(--ds-bg-elevated) text-(--ds-text-primary) transition-colors duration-150 hover:border-primary-500 hover:text-primary-500'
		>
			<svg
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth={2}
				strokeLinecap='round'
				strokeLinejoin='round'
				aria-hidden='true'
				className='size-4'
			>
				{children}
			</svg>
		</button>
	);
}
