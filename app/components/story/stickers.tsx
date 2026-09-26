import classNames from 'classnames';
import type { ReactNode } from 'react';

/*
  Illustrated stickers for the story, drawn on a 120×120 grid. They are
  physical objects on the board, so they keep their own colours in both
  themes. The white die-cut edge and shadow come from the `.sticker` class
  (app/site.css).
*/

const INK = '#1f2937';
const PINK = '#de1d8d';
const YELLOW = '#facc15';
const CYAN = '#22d3ee';
const GREEN = '#22c55e';
const BLUE = '#3b82f6';
const ORANGE = '#f97316';
const PURPLE = '#8b5cf6';
const PAPER = '#fffbeb';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const line = {
	stroke: INK,
	strokeWidth: 3,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
} as const;

function Checkers() {
	const cells: ReactNode[] = [];
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 4; col++) {
			cells.push(
				<rect
					key={`${row}-${col}`}
					x={32 + col * 17}
					y={22 + row * 16}
					width={17}
					height={16}
					fill={(row + col) % 2 ? '#fff' : INK}
				/>,
			);
		}
	}
	return <>{cells}</>;
}

const art = {
	controller: {
		label: 'Game controller',
		svg: (
			<>
				<path
					d='M32 40h56c14 0 23 12 25 30 2 17-4 28-13 28-8 0-12-7-17-14H37c-5 7-9 14-17 14-9 0-15-11-13-28 2-18 11-30 25-30z'
					fill={BLUE}
					{...line}
				/>
				<rect x={24} y={60} width={20} height={7} rx={1.5} fill={INK} />
				<rect x={30.5} y={53.5} width={7} height={20} rx={1.5} fill={INK} />
				<circle cx={86} cy={55} r={5} fill={YELLOW} {...line} strokeWidth={2} />
				<circle cx={96} cy={64} r={5} fill={PINK} {...line} strokeWidth={2} />
				<circle cx={76} cy={64} r={5} fill={GREEN} {...line} strokeWidth={2} />
				<circle cx={86} cy={73} r={5} fill={CYAN} {...line} strokeWidth={2} />
			</>
		),
	},
	'fps-counter': {
		label: 'FPS counter reading 12 FPS',
		svg: (
			<>
				<rect
					x={8}
					y={28}
					width={104}
					height={64}
					rx={12}
					fill='#111827'
					{...line}
				/>
				<text
					x={60}
					y={58}
					textAnchor='middle'
					fontFamily={MONO}
					fontSize={22}
					fontWeight={700}
					fill={GREEN}
				>
					12 FPS
				</text>
				<polyline
					points='20,82 34,77 46,80 58,71 70,74 82,64 100,58'
					fill='none'
					stroke={ORANGE}
					strokeWidth={3}
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</>
		),
	},
	'racing-flag': {
		label: 'Checkered racing flag',
		svg: (
			<g transform='rotate(-8 60 60)'>
				<Checkers />
				<rect x={32} y={22} width={68} height={48} fill='none' {...line} />
				<line x1={30} y1={16} x2={30} y2={108} {...line} strokeWidth={6} />
				<circle cx={30} cy={14} r={5} fill={YELLOW} {...line} strokeWidth={2} />
			</g>
		),
	},
	terminal: {
		label: 'Terminal running aircrack-ng',
		svg: (
			<>
				<rect
					x={8}
					y={20}
					width={104}
					height={80}
					rx={10}
					fill='#0b1120'
					{...line}
				/>
				<path d='M8 36h104' {...line} />
				<circle cx={20} cy={28} r={3} fill='#ef4444' />
				<circle cx={30} cy={28} r={3} fill={YELLOW} />
				<circle cx={40} cy={28} r={3} fill={GREEN} />
				<text x={16} y={56} fontFamily={MONO} fontSize={11} fill={GREEN}>
					$ airmon-ng
				</text>
				<text x={16} y={72} fontFamily={MONO} fontSize={11} fill={GREEN}>
					$ aircrack-ng
				</text>
				<rect
					x={16}
					y={80}
					width={8}
					height={11}
					fill={GREEN}
					className='motion-safe:animate-pulse'
				/>
			</>
		),
	},
	penguin: {
		label: 'Penguin',
		svg: (
			<>
				<ellipse cx={60} cy={64} rx={32} ry={42} fill={INK} {...line} />
				<ellipse cx={60} cy={74} rx={21} ry={29} fill='#fff' />
				<circle cx={50} cy={44} r={7} fill='#fff' />
				<circle cx={70} cy={44} r={7} fill='#fff' />
				<circle cx={51} cy={45} r={3} fill={INK} />
				<circle cx={69} cy={45} r={3} fill={INK} />
				<path d='M52 55l8 8 8-8z' fill={YELLOW} {...line} strokeWidth={2} />
				<ellipse
					cx={46}
					cy={106}
					rx={11}
					ry={5}
					fill={ORANGE}
					{...line}
					strokeWidth={2}
				/>
				<ellipse
					cx={74}
					cy={106}
					rx={11}
					ry={5}
					fill={ORANGE}
					{...line}
					strokeWidth={2}
				/>
			</>
		),
	},
	'wifi-cracked': {
		label: 'Wi-Fi signal with an open padlock',
		svg: (
			<>
				<path
					d='M14 50a66 66 0 0 1 92 0'
					fill='none'
					{...line}
					stroke={PINK}
					strokeWidth={9}
				/>
				<path
					d='M30 66a43 43 0 0 1 60 0'
					fill='none'
					{...line}
					stroke={PINK}
					strokeWidth={9}
				/>
				<path
					d='M46 82a20 20 0 0 1 28 0'
					fill='none'
					{...line}
					stroke={PINK}
					strokeWidth={9}
				/>
				<circle cx={60} cy={96} r={7} fill={PINK} />
				<path
					d='M84 78v-8a9 9 0 0 1 18 0'
					fill='none'
					{...line}
					strokeWidth={4}
				/>
				<rect
					x={78}
					y={84}
					width={30}
					height={24}
					rx={5}
					fill={YELLOW}
					{...line}
				/>
				<circle cx={93} cy={96} r={3} fill={INK} />
			</>
		),
	},
	'exam-sheet': {
		label: 'JEE answer sheet with a pencil',
		svg: (
			<>
				<g transform='rotate(-6 60 60)'>
					<rect
						x={20}
						y={10}
						width={76}
						height={100}
						rx={4}
						fill={PAPER}
						{...line}
					/>
					<text
						x={58}
						y={30}
						textAnchor='middle'
						fontFamily={MONO}
						fontSize={14}
						fontWeight={700}
						fill={INK}
					>
						JEE
					</text>
					{[44, 58, 72, 86].map((y, row) =>
						[36, 50, 64, 78].map((x, col) => (
							<circle
								key={`${x}-${y}`}
								cx={x}
								cy={y}
								r={4.5}
								fill={(row * 3 + col) % 4 === 1 ? INK : 'none'}
								stroke={INK}
								strokeWidth={1.5}
							/>
						)),
					)}
				</g>
				<g transform='rotate(40 88 78)'>
					<rect x={80} y={40} width={14} height={60} fill={YELLOW} {...line} />
					<path d='M80 100l7 14 7-14z' fill={PAPER} {...line} />
					<rect x={80} y={34} width={14} height={8} fill={PINK} {...line} />
				</g>
			</>
		),
	},
	'hard-drive': {
		label: 'External hard drive labelled 1.2 TB',
		svg: (
			<>
				<rect
					x={16}
					y={14}
					width={88}
					height={92}
					rx={12}
					fill='#9ca3af'
					{...line}
				/>
				<rect
					x={26}
					y={26}
					width={68}
					height={40}
					rx={4}
					fill={PAPER}
					{...line}
					strokeWidth={2}
				/>
				<text
					x={60}
					y={53}
					textAnchor='middle'
					fontFamily={MONO}
					fontSize={17}
					fontWeight={700}
					fill={INK}
				>
					1.2 TB
				</text>
				<circle
					cx={90}
					cy={92}
					r={4}
					fill={GREEN}
					className='motion-safe:animate-pulse'
				/>
				<path d='M28 82h38M28 92h26' {...line} strokeWidth={2.5} />
			</>
		),
	},
	magnet: {
		label: 'Magnet pulling a download arrow',
		svg: (
			<>
				<path
					d='M22 18h24v42a14 14 0 0 0 28 0V18h24v42a38 38 0 0 1-76 0z'
					fill='#ef4444'
					{...line}
				/>
				<rect x={22} y={18} width={24} height={16} fill='#e5e7eb' {...line} />
				<rect x={74} y={18} width={24} height={16} fill='#e5e7eb' {...line} />
				<path
					d='M60 78v26m-10-10l10 10 10-10'
					fill='none'
					{...line}
					stroke={GREEN}
					strokeWidth={5}
				/>
			</>
		),
	},
	laptop: {
		label: 'Laptop',
		svg: (
			<>
				<rect
					x={20}
					y={22}
					width={80}
					height={56}
					rx={6}
					fill='#d1d5db'
					{...line}
				/>
				<rect x={27} y={29} width={66} height={42} rx={2} fill='#0b1120' />
				<text x={32} y={46} fontFamily={MONO} fontSize={9} fill={GREEN}>
					~ ssh home
				</text>
				<text x={32} y={60} fontFamily={MONO} fontSize={9} fill={CYAN}>
					connected
				</text>
				<path d='M8 84h104l-8 12H16z' fill='#e5e7eb' {...line} />
				<path d='M50 84h20' {...line} strokeWidth={2} />
			</>
		),
	},
	'server-rack': {
		label: 'Home server rack',
		svg: (
			<>
				<rect
					x={28}
					y={8}
					width={64}
					height={104}
					rx={6}
					fill='#374151'
					{...line}
				/>
				{[18, 46, 74].map((y, i) => (
					<g key={y}>
						<rect
							x={36}
							y={y}
							width={48}
							height={22}
							rx={3}
							fill='#111827'
							{...line}
							strokeWidth={2}
						/>
						<circle
							cx={44}
							cy={y + 11}
							r={3}
							fill={GREEN}
							className='motion-safe:animate-pulse'
							style={{ animationDelay: `${i * 400}ms` }}
						/>
						<circle cx={54} cy={y + 11} r={3} fill={i === 1 ? ORANGE : CYAN} />
						<path
							d={`M64 ${y + 8}h14M64 ${y + 14}h14`}
							stroke='#6b7280'
							strokeWidth={2}
						/>
					</g>
				))}
			</>
		),
	},
	whale: {
		label: 'Whale carrying shipping containers',
		svg: (
			<>
				<rect
					x={30}
					y={26}
					width={18}
					height={16}
					fill={PINK}
					{...line}
					strokeWidth={2}
				/>
				<rect
					x={50}
					y={26}
					width={18}
					height={16}
					fill={YELLOW}
					{...line}
					strokeWidth={2}
				/>
				<rect
					x={50}
					y={8}
					width={18}
					height={16}
					fill={GREEN}
					{...line}
					strokeWidth={2}
				/>
				<rect
					x={70}
					y={26}
					width={18}
					height={16}
					fill={CYAN}
					{...line}
					strokeWidth={2}
				/>
				<path
					d='M10 46h84c6-10 16-12 20-6-6 2-8 6-8 10 0 26-24 44-54 44-24 0-42-18-42-48z'
					fill={BLUE}
					{...line}
				/>
				<circle cx={28} cy={62} r={3.5} fill={INK} />
				<path
					d='M20 76c8 6 20 6 28 0'
					fill='none'
					{...line}
					stroke='#fff'
					strokeWidth={2.5}
				/>
			</>
		),
	},
	gopher: {
		label: 'Gopher mascot',
		svg: (
			<>
				<circle cx={32} cy={26} r={9} fill='#c4a484' {...line} />
				<circle cx={88} cy={26} r={9} fill='#c4a484' {...line} />
				<path
					d='M60 16c26 0 38 20 38 46v38c0 8-6 12-14 12H36c-8 0-14-4-14-12V62c0-26 12-46 38-46z'
					fill='#c4a484'
					{...line}
				/>
				<circle cx={44} cy={46} r={12} fill='#fff' {...line} strokeWidth={2} />
				<circle cx={76} cy={46} r={12} fill='#fff' {...line} strokeWidth={2} />
				<circle cx={47} cy={48} r={5} fill={INK} />
				<circle cx={73} cy={48} r={5} fill={INK} />
				<ellipse
					cx={60}
					cy={64}
					rx={9}
					ry={6}
					fill='#8b6b4a'
					{...line}
					strokeWidth={2}
				/>
				<rect
					x={54}
					y={69}
					width={12}
					height={10}
					rx={1}
					fill='#fff'
					{...line}
					strokeWidth={2}
				/>
				<path d='M60 69v10' stroke={INK} strokeWidth={1.5} />
			</>
		),
	},
	'merged-pr': {
		label: 'Merged pull request badge',
		svg: (
			<>
				<rect
					x={6}
					y={38}
					width={108}
					height={44}
					rx={22}
					fill={PURPLE}
					{...line}
				/>
				<circle
					cx={28}
					cy={50}
					r={4}
					fill='none'
					stroke='#fff'
					strokeWidth={3}
				/>
				<circle
					cx={28}
					cy={70}
					r={4}
					fill='none'
					stroke='#fff'
					strokeWidth={3}
				/>
				<circle
					cx={42}
					cy={62}
					r={4}
					fill='none'
					stroke='#fff'
					strokeWidth={3}
				/>
				<path
					d='M28 54v12M31 52c0 6 4 10 8 10'
					fill='none'
					stroke='#fff'
					strokeWidth={3}
				/>
				<text
					x={52}
					y={67}
					fontFamily={MONO}
					fontSize={15}
					fontWeight={700}
					fill='#fff'
				>
					merged
				</text>
			</>
		),
	},
	'go-run': {
		label: 'Command: go run .',
		svg: (
			<>
				<rect
					x={8}
					y={40}
					width={104}
					height={40}
					rx={8}
					fill={CYAN}
					{...line}
				/>
				<text
					x={60}
					y={66}
					textAnchor='middle'
					fontFamily={MONO}
					fontSize={17}
					fontWeight={700}
					fill={INK}
				>
					go run .
				</text>
			</>
		),
	},
	'open-quote': {
		label: 'Note: code should be open',
		svg: (
			<>
				<rect
					x={12}
					y={16}
					width={96}
					height={88}
					rx={4}
					fill={YELLOW}
					{...line}
					transform='rotate(4 60 60)'
				/>
				<text
					x={24}
					y={52}
					fontFamily='Georgia, serif'
					fontSize={44}
					fontWeight={700}
					fill={INK}
				>
					“
				</text>
				<text
					x={26}
					y={70}
					fontFamily={MONO}
					fontSize={11}
					fontWeight={700}
					fill={INK}
				>
					code should
				</text>
				<text
					x={26}
					y={86}
					fontFamily={MONO}
					fontSize={11}
					fontWeight={700}
					fill={INK}
				>
					be open
				</text>
			</>
		),
	},
	'heart-code': {
		label: 'Heart with a code symbol',
		svg: (
			<>
				<path
					d='M60 104C24 80 10 62 10 42c0-16 12-28 27-28 10 0 18 5 23 13 5-8 13-13 23-13 15 0 27 12 27 28 0 20-14 38-50 62z'
					fill={PINK}
					{...line}
				/>
				<path
					d='M44 48l-10 10 10 10M76 48l10 10-10 10M64 44l-8 28'
					fill='none'
					{...line}
					stroke='#fff'
					strokeWidth={5}
				/>
			</>
		),
	},
	'badge-now': {
		label: 'Starburst badge: still learning',
		svg: (
			<>
				<path d={starburst(60, 60, 54, 42, 14)} fill={GREEN} {...line} />
				<text
					x={60}
					y={56}
					textAnchor='middle'
					fontFamily={MONO}
					fontSize={13}
					fontWeight={700}
					fill={INK}
				>
					still
				</text>
				<text
					x={60}
					y={72}
					textAnchor='middle'
					fontFamily={MONO}
					fontSize={13}
					fontWeight={700}
					fill={INK}
				>
					learning
				</text>
			</>
		),
	},
} satisfies Record<string, { label: string; svg: ReactNode }>;

function starburst(
	cx: number,
	cy: number,
	outer: number,
	inner: number,
	points: number,
) {
	const step = Math.PI / points;
	let d = '';
	for (let i = 0; i < points * 2; i++) {
		const r = i % 2 ? inner : outer;
		const x = cx + r * Math.cos(i * step - Math.PI / 2);
		const y = cy + r * Math.sin(i * step - Math.PI / 2);
		d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
	}
	return `${d}Z`;
}

export type StickerId = keyof typeof art;

export const stickerIds = Object.keys(art) as StickerId[];

export function Sticker({
	id,
	className,
}: {
	id: StickerId;
	className?: string;
}) {
	const { label, svg } = art[id];
	return (
		<svg
			viewBox='0 0 120 120'
			role='img'
			aria-label={label}
			className={classNames('sticker', className)}
		>
			<title>{label}</title>
			{svg}
		</svg>
	);
}
