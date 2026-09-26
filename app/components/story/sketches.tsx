import type { ReactNode, SVGProps } from 'react';

/*
  Line sketches for the story, drawn on a 48×48 grid in the site's own ink
  (currentColor) with a single pink accent, so they sit with the rest of
  the site's thin borders instead of looking like clip art.
*/

const ACCENT = '#de1d8d';

const dot = (cx: number, cy: number, r = 1.4, fill = 'currentColor') => (
	<circle cx={cx} cy={cy} r={r} fill={fill} stroke='none' />
);

const art = {
	controller: {
		label: 'Game controller',
		svg: (
			<>
				<path d='M14 16h20c5 0 8 4 9 11s-1 11-4 11c-3 0-5-3-7-6H16c-2 3-4 6-7 6-3 0-5-4-4-11s4-11 9-11z' />
				<path d='M14 21v7M10.5 24.5h7' />
				{dot(32, 22, 1.6, ACCENT)}
				{dot(36, 26, 1.6)}
			</>
		),
	},
	'fps-counter': {
		label: 'Frame-rate graph',
		svg: (
			<>
				<rect x={6} y={10} width={36} height={28} rx={3} />
				<path d='M11 32l6-4 5 2 6-8 5 3 5-8' stroke={ACCENT} />
				<path d='M11 16h8' />
			</>
		),
	},
	'racing-flag': {
		label: 'Checkered flag',
		svg: (
			<>
				<path d='M12 43V5' />
				<path d='M12 8h26v16H12' />
				<g fill='currentColor' stroke='none'>
					<rect x={12} y={8} width={6.5} height={8} />
					<rect x={25} y={8} width={6.5} height={8} />
					<rect x={18.5} y={16} width={6.5} height={8} />
					<rect x={31.5} y={16} width={6.5} height={8} />
				</g>
			</>
		),
	},
	terminal: {
		label: 'Terminal',
		svg: (
			<>
				<rect x={6} y={9} width={36} height={30} rx={3} />
				<path d='M6 15h36' />
				<path d='M12 22l5 4-5 4' />
				<path d='M21 31h10' stroke={ACCENT} />
			</>
		),
	},
	penguin: {
		label: 'Penguin',
		svg: (
			<>
				<path d='M24 6c-7 0-10 6-10 13 0 5-5 9-5 15 0 5 7 8 15 8s15-3 15-8c0-6-5-10-5-15 0-7-3-13-10-13z' />
				<path d='M24 21c-4 0-6 5-6 10s2 8 6 8 6-3 6-8-2-10-6-10z' />
				{dot(21, 14)}
				{dot(27, 14)}
				<path d='M22 18h4l-2 2.5z' fill={ACCENT} stroke={ACCENT} />
			</>
		),
	},
	'wifi-cracked': {
		label: 'Wi-Fi with an open lock',
		svg: (
			<>
				<path d='M6 20a25 25 0 0 1 36 0M12 26a16 16 0 0 1 24 0M18 32a8 8 0 0 1 12 0' />
				{dot(24, 37, 2)}
				<rect x={33} y={37} width={10} height={8} rx={1.5} stroke={ACCENT} />
				<path d='M35 37v-3a3 3 0 0 1 6 0' stroke={ACCENT} />
			</>
		),
	},
	'exam-sheet': {
		label: 'Answer sheet and pencil',
		svg: (
			<>
				<rect x={9} y={5} width={25} height={35} rx={2} />
				{[15, 21, 27].map((x) =>
					[14, 21, 28].map((y) => (
						<circle
							key={`${x}-${y}`}
							cx={x}
							cy={y}
							r={2}
							fill={(x + y) % 4 === 1 ? 'currentColor' : 'none'}
							strokeWidth={1}
						/>
					)),
				)}
				<path d='M30 44l12-12 3 3-12 12h-3z' stroke={ACCENT} />
			</>
		),
	},
	'hard-drive': {
		label: 'Hard drive',
		svg: (
			<>
				<rect x={10} y={6} width={28} height={36} rx={3} />
				<rect x={14} y={10} width={20} height={12} rx={1} />
				<path d='M14 33h10M14 37h6' />
				{dot(33, 35, 1.8, ACCENT)}
			</>
		),
	},
	magnet: {
		label: 'Magnet',
		svg: (
			<>
				<path d='M11 6v16a13 13 0 0 0 26 0V6h-8v16a5 5 0 0 1-10 0V6z' />
				<path d='M11 12h8M29 12h8' />
				<path d='M24 38v7M21 42l3 3 3-3' stroke={ACCENT} />
			</>
		),
	},
	laptop: {
		label: 'Laptop',
		svg: (
			<>
				<rect x={10} y={10} width={28} height={20} rx={2} />
				<path d='M5 34h38l-3 4H8z' />
				<path d='M15 17l3 3-3 3' stroke={ACCENT} />
			</>
		),
	},
	'server-rack': {
		label: 'Server rack',
		svg: (
			<>
				<rect x={12} y={4} width={24} height={40} rx={2} />
				<path d='M12 17h24M12 30h24' />
				{[10.5, 23.5, 36.5].map((y) => (
					<g key={y}>
						{dot(17, y, 1.4, ACCENT)}
						<path d={`M24 ${y}h8`} />
					</g>
				))}
			</>
		),
	},
	whale: {
		label: 'Whale carrying containers',
		svg: (
			<>
				<path d='M5 25h31c2-3 5-4 7-2-2 1-3 2-3 4 0 9-8 14-18 14-10 0-17-7-17-16z' />
				<rect x={9} y={18} width={6} height={6} />
				<rect x={16} y={18} width={6} height={6} />
				<rect x={23} y={18} width={6} height={6} />
				<rect x={16} y={11} width={6} height={6} stroke={ACCENT} />
				{dot(11, 30)}
			</>
		),
	},
	gopher: {
		label: 'Gopher',
		svg: (
			<>
				<circle cx={13} cy={11} r={3} />
				<circle cx={35} cy={11} r={3} />
				<path d='M24 7c9 0 13 6 13 14v16c0 3-2 5-5 5H16c-3 0-5-2-5-5V21c0-8 4-14 13-14z' />
				<circle cx={19} cy={18} r={4} />
				<circle cx={29} cy={18} r={4} />
				{dot(20, 18.5)}
				{dot(28, 18.5)}
				<ellipse cx={24} cy={25} rx={3} ry={2} stroke={ACCENT} fill={ACCENT} />
				<path d='M22 27v4h4v-4' />
			</>
		),
	},
	'merged-pr': {
		label: 'Merged pull request',
		svg: (
			<>
				<circle cx={14} cy={9} r={3.5} />
				<circle cx={14} cy={39} r={3.5} />
				<circle cx={34} cy={24} r={3.5} stroke={ACCENT} />
				<path d='M14 12.5v23M14 12.5c0 7 6 11.5 16.5 11.5' />
			</>
		),
	},
	'go-run': {
		label: 'Command: go run',
		svg: (
			<>
				<rect x={5} y={13} width={38} height={22} rx={3} />
				<path d='M10 20l4 4-4 4' />
				<text
					x={18}
					y={28}
					fontFamily='ui-monospace, SFMono-Regular, Menlo, monospace'
					fontSize={10}
					fill='currentColor'
					stroke='none'
				>
					go
				</text>
				<path d='M32 29h5' stroke={ACCENT} />
			</>
		),
	},
	'open-quote': {
		label: 'Quotation mark',
		svg: (
			<>
				<path d='M9 28c0-7 3-12 9-14v4c-3 1-4 4-4 6h4v10H9z' />
				<path
					d='M25 28c0-7 3-12 9-14v4c-3 1-4 4-4 6h4v10h-9z'
					stroke={ACCENT}
				/>
				<path d='M9 42h30' />
			</>
		),
	},
	'heart-code': {
		label: 'Heart with a code symbol',
		svg: (
			<>
				<path d='M24 41C12 33 5 26 5 18c0-5 4-9 9-9 4 0 8 2 10 5 2-3 6-5 10-5 5 0 9 4 9 9 0 8-7 15-19 23z' />
				<path d='M19 18l-4 4 4 4M29 18l4 4-4 4' stroke={ACCENT} />
			</>
		),
	},
	'open-book': {
		label: 'Open book',
		svg: (
			<>
				<path d='M24 14c-4-3-10-4-17-3v26c7-1 13 0 17 3 4-3 10-4 17-3V11c-7-1-13 0-17 3z' />
				<path d='M24 14v26' />
				<path d='M31 11v9l2.5-2 2.5 2v-9.5' stroke={ACCENT} />
			</>
		),
	},
} satisfies Record<string, { label: string; svg: ReactNode }>;

export type SketchId = keyof typeof art;

/** A 48×48 line sketch; pass x/y/width/height to place it inside an SVG. */
export function Sketch({
	id,
	...props
}: { id: SketchId } & SVGProps<SVGSVGElement>) {
	const { label, svg } = art[id];
	return (
		<svg
			viewBox='0 0 48 48'
			fill='none'
			stroke='currentColor'
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}
		>
			<title>{label}</title>
			{svg}
		</svg>
	);
}
