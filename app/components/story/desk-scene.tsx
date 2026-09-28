'use client';

import { type MotionValue, motion, useTransform } from 'motion/react';
import { type ComponentProps, createContext, type ReactNode, use } from 'react';
import type { PhaseMeta } from './get-story';
import { Sketch } from './sketches';

/*
  One desk, drawn as a line sketch on a 400×300 grid, that changes with the
  story. Nothing here switches at a threshold: every part follows `p`, the
  scroll position as a phase (0 = gamer … 5 = now, fractions in between), so
  the scene drifts from one phase to the next as you scroll, both ways.

  Everything is drawn in currentColor with the site's orange as the only
  accent; shapes that must hide what's behind them are filled with the page
  background.
*/

const ACCENT = '#ff5f00'; // utc-ds --ds-primary
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const BG = 'fill-(--ds-bg-primary)';
const SCREEN = 'fill-(--ds-bg-code)';

// The framed print on the wall, and the wall calendar next to it.
const FRAME = { x: 292, y: 16, size: 72 };
const CALENDAR = { x: 180, y: 22, w: 64, h: 74 };
// The day the calendar is on in each phase; the days before it are crossed
// off as the phase scrolls in. Only the year is real (from content/story.mdx).
const today = [9, 23, 16, 28, 12, 20];
const DAYS = Array.from({ length: 31 }, (_, i) => i);

type Phase = MotionValue<number>;

/** 1 while phase `i` is on, fading to 0 half a phase away: a crossfade. */
function useBump(p: Phase, i: number) {
	return useTransform(p, [i - 0.5, i - 0.15, i + 0.15, i + 0.5], [0, 1, 1, 0]);
}

export default function DeskScene({
	phases,
	p,
}: {
	phases: PhaseMeta[];
	p: Phase;
}) {
	// The window: night for the Wi-Fi years, dawn for JEE, day otherwise.
	const night = useTransform(p, [0.4, 0.8, 1.2, 1.6], [0, 1, 1, 0]);
	const dawn = useTransform(p, [1.4, 1.8, 2.2, 2.6], [0, 1, 1, 0]);
	const day = useTransform(() => Math.max(0, 1 - night.get() - dawn.get()));
	const sunY = useTransform(p, [2.2, 3.2], [16, 0]);

	// The old PC carries itself onto the shelf to become the home server.
	const move = useTransform(p, [2.3, 2.95], [0, 1]);
	const pcX = useTransform(move, [0, 1], [314, 98]);
	const pcY = useTransform(
		move,
		(m) => 134 - 30 * m - 10 * Math.sin(Math.PI * m),
	);
	const pcScale = useTransform(move, [0, 1], [1, 0.7]);
	const pcTilt = useTransform(move, (m) => -8 * Math.sin(Math.PI * m));

	const stem = useTransform(p, (v) => 132 - v * 11);

	return (
		<svg
			viewBox='0 0 400 300'
			fill='none'
			stroke='currentColor'
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
			className='h-auto w-full text-(--ds-text-primary)'
			role='img'
			aria-label='My desk, changing with each phase'
		>
			{/* Desk */}
			<path d='M0 214h400M0 222h400M28 222v78M372 222v78' />

			{/* Window, with the time of day */}
			<rect x={20} y={14} width={104} height={82} rx={2} />
			<path d='M72 14v82M20 55h104' strokeWidth={1} />
			<motion.g style={{ opacity: night }}>
				<path d='M104 28a9 9 0 1 0 6 14 7 7 0 0 1-6-14z' />
				{[
					[32, 26],
					[52, 40],
					[40, 70],
					[90, 78],
				].map(([cx, cy]) => (
					<circle
						key={`${cx}-${cy}`}
						cx={cx}
						cy={cy}
						r={1}
						fill='currentColor'
					/>
				))}
			</motion.g>
			<motion.g style={{ opacity: dawn }}>
				<path d='M80 90a14 14 0 0 1 28 0' stroke={ACCENT} />
				<path d='M76 90h36M94 68v-6M110 74l4-4M78 74l-4-4' strokeWidth={1} />
			</motion.g>
			<motion.g style={{ opacity: day }}>
				<motion.circle
					cx={98}
					cy={34}
					r={8}
					stroke={ACCENT}
					style={{ y: sunY }}
				/>
				<path d='M30 44c4-6 12-6 16 0M40 80c4-6 12-6 16 0' strokeWidth={1} />
			</motion.g>

			{/* Shelf */}
			<path d='M14 160h122M24 160v8l8-8M126 160v8l-8-8' />

			{/* Plant on the shelf: it grows a leaf per phase */}
			<motion.line x1={34} y1={142} x2={34} y2={stem} />
			{phases.map((phase, i) => (
				<Leaf key={phase.id} p={p} i={i} />
			))}
			<path d='M24 142h20l-3 18H27z' className={BG} />

			<Appear p={p} at={1}>
				{/* Router */}
				<Draw.rect
					x={54}
					y={146}
					width={34}
					height={14}
					rx={2}
					className={BG}
				/>
				<Draw.path d='M60 146l-3-14M82 146l3-14' />
				<circle
					cx={62}
					cy={153}
					r={1.5}
					fill={ACCENT}
					stroke='none'
					className='motion-safe:animate-pulse'
				/>
				<circle cx={68} cy={153} r={1.5} fill='currentColor' stroke='none' />
			</Appear>

			{/* Old PC: on the desk until college, then it becomes the home server */}
			<motion.g
				style={{
					x: pcX,
					y: pcY,
					scale: pcScale,
					rotate: pcTilt,
					originX: 0,
					originY: 0,
				}}
			>
				<rect width={46} height={80} rx={3} className={BG} />
				<path d='M9 12h28M9 20h28' strokeWidth={1} />
				<circle cx={23} cy={60} r={5} />
				<circle cx={38} cy={72} r={2} stroke='none' fill='currentColor' />
				<motion.circle
					cx={38}
					cy={72}
					r={2}
					stroke='none'
					fill={ACCENT}
					style={{ opacity: move }}
				/>
			</motion.g>

			{/* Hard drives, stacked one by one */}
			{[0, 1, 2].map((i) => (
				<Appear key={i} p={p} at={1.8 + i * 0.1}>
					<g transform={`translate(${72 + i * 3} ${202 - i * 11})`}>
						<Draw.rect width={46} height={11} rx={2} className={BG} />
						<circle
							cx={40}
							cy={5.5}
							r={1.3}
							fill='currentColor'
							stroke='none'
						/>
					</g>
				</Appear>
			))}

			{/* Monitor */}
			<path d='M212 192v14M192 212h40' />
			<rect x={148} y={110} width={128} height={82} rx={4} className={BG} />
			<rect
				x={155}
				y={117}
				width={114}
				height={68}
				rx={1}
				className={SCREEN}
				strokeWidth={1}
			/>
			{screens.map((screen, i) => (
				<Screen key={screen.key} p={p} i={i}>
					{screen}
				</Screen>
			))}

			<Appear p={p} at={3}>
				{/* Laptop takes the old PC's spot */}
				<Draw.rect
					x={304}
					y={166}
					width={70}
					height={42}
					rx={3}
					className={BG}
				/>
				<Draw.rect
					x={310}
					y={172}
					width={58}
					height={30}
					rx={1}
					className={SCREEN}
					strokeWidth={1}
				/>
				<path d='M316 182l4 3-4 3' stroke={ACCENT} />
				<path d='M324 191h14' strokeWidth={1} />
				<Draw.path d='M294 208h90l-5 6h-80z' className={BG} />
			</Appear>

			<Appear p={p} at={4}>
				{/* Gopher figurine on the monitor */}
				<g transform='translate(248 84)'>
					<Draw.path
						d='M14 2c8 0 11 5 11 12v12H3V14C3 7 6 2 14 2z'
						className={BG}
					/>
					<Draw.circle cx={10} cy={10} r={3} />
					<Draw.circle cx={18} cy={10} r={3} />
					<ellipse
						cx={14}
						cy={16}
						rx={2}
						ry={1.3}
						fill={ACCENT}
						stroke={ACCENT}
					/>
				</g>
			</Appear>

			<Appear p={p} at={5}>
				{/* Coffee */}
				<Draw.path
					d='M128 194h16v16a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3z'
					className={BG}
				/>
				<Draw.path d='M144 198a5 5 0 0 1 0 10' />
				<path
					d='M133 188c0-3 2-3 2-6M139 188c0-3 2-3 2-6'
					strokeWidth={1}
					className='motion-safe:animate-pulse'
				/>
			</Appear>

			{/* Wall calendar: one page per phase, the top one tears off */}
			<g>
				<path
					d={`M${CALENDAR.x + CALENDAR.w / 2} ${CALENDAR.y - 8}l-${CALENDAR.w / 3} 8M${CALENDAR.x + CALENDAR.w / 2} ${CALENDAR.y - 8}l${CALENDAR.w / 3} 8`}
					strokeWidth={1}
				/>
				<rect
					x={CALENDAR.x + 2}
					y={CALENDAR.y + 2}
					width={CALENDAR.w}
					height={CALENDAR.h}
					className={BG}
					strokeWidth={1}
				/>
				{phases
					.map((phase, i) => (
						<CalendarPage
							key={phase.id}
							p={p}
							i={i}
							last={i === phases.length - 1}
							year={phase.year}
						/>
					))
					.reverse()}
			</g>

			{/* Framed print: the current phase's sketch */}
			<Frame />
			{phases.map((phase, i) => (
				<Print key={phase.id} p={p} i={i} phase={phase} />
			))}
		</svg>
	);
}

/**
 * Parts of the scene that arrive in a phase. As `p` nears `at` they fade in
 * and settle, while the lines of their `Draw.*` shapes draw themselves.
 */
const DrawProgress = createContext<MotionValue<number> | null>(null);

function Appear({
	p,
	at,
	children,
}: {
	p: Phase;
	at: number;
	children: ReactNode;
}) {
	const t = useTransform(p, [at - 0.6, at - 0.05], [0, 1]);
	const opacity = useTransform(t, [0, 0.2], [0, 1]);
	const y = useTransform(t, [0, 1], [-8, 0]);
	return (
		<DrawProgress value={t}>
			<motion.g style={{ opacity, y }}>{children}</motion.g>
		</DrawProgress>
	);
}

function useDraw() {
	const t = use(DrawProgress);
	if (!t) throw new Error('Draw.* must be used inside <Appear>');
	return t;
}

// Shapes whose outline is drawn by the surrounding <Appear>.
function DrawPath(props: ComponentProps<typeof motion.path>) {
	return <motion.path {...props} style={{ pathLength: useDraw() }} />;
}

function DrawRect(props: ComponentProps<typeof motion.rect>) {
	return <motion.rect {...props} style={{ pathLength: useDraw() }} />;
}

function DrawCircle(props: ComponentProps<typeof motion.circle>) {
	return <motion.circle {...props} style={{ pathLength: useDraw() }} />;
}

const Draw = { path: DrawPath, rect: DrawRect, circle: DrawCircle };

function Leaf({ p, i }: { p: Phase; i: number }) {
	const grow = useTransform(p, [i - 0.6, i - 0.1], [0, 1]);
	const scale = useTransform(grow, [0, 1], [0.3, 1]);
	const left = i % 2 === 0;
	const y = 136 - i * 11;
	return (
		<motion.path
			d={
				left
					? `M34 ${y}c-4-6-12-6-14-2 4 4 10 4 14 2z`
					: `M34 ${y}c4-6 12-6 14-2-4 4-10 4-14 2z`
			}
			style={{ opacity: grow, scale, originX: left ? 1 : 0, originY: 0.5 }}
		/>
	);
}

function Screen({
	p,
	i,
	children,
}: {
	p: Phase;
	i: number;
	children: ReactNode;
}) {
	const opacity = useBump(p, i);
	return <motion.g style={{ opacity }}>{children}</motion.g>;
}

function Print({ p, i, phase }: { p: Phase; i: number; phase: PhaseMeta }) {
	const opacity = useBump(p, i);
	const y = useTransform(p, [i - 0.5, i, i + 0.5], [-6, 0, 6]);
	return (
		<motion.g style={{ opacity, y }}>
			<Sketch
				id={phase.sketch}
				x={FRAME.x + 10}
				y={FRAME.y + 10}
				width={FRAME.size - 20}
				height={FRAME.size - 20}
			/>
		</motion.g>
	);
}

function Frame() {
	const { x, y, size } = FRAME;
	const hook = `M${x + size / 2} ${y - 8}`;
	return (
		<>
			<path d={`${hook}l-${size / 3} 8${hook}l${size / 3} 8`} strokeWidth={1} />
			<rect x={x} y={y} width={size} height={size} className={BG} />
			<rect
				x={x + 4}
				y={y + 4}
				width={size - 8}
				height={size - 8}
				strokeWidth={0.75}
			/>
		</>
	);
}

/**
 * One page of the tear-off wall calendar. Its days get crossed off as its
 * phase scrolls in; scrolling on to the next phase tears it off, revealing
 * the next page underneath (pages are stacked with the earliest on top).
 */
function CalendarPage({
	p,
	i,
	last,
	year,
}: {
	p: Phase;
	i: number;
	last: boolean;
	year?: number;
}) {
	const { x, y, w, h } = CALENDAR;
	const day = today[i % today.length];
	const crossed = useTransform(p, [i - 0.45, i - 0.05], [0, day]);
	const tear = useTransform(p, [i + 0.2, i + 0.6], [1, 0]);
	const opacity = useTransform(p, [i + 0.4, i + 0.6], [1, 0]);

	return (
		<motion.g
			style={
				last ? undefined : { scaleY: tear, opacity, originY: 0, originX: 0.5 }
			}
		>
			<rect x={x} y={y} width={w} height={h} className={BG} />
			<rect x={x} y={y} width={w} height={14} fill={ACCENT} stroke={ACCENT} />
			<text
				x={x + w / 2}
				y={y + 10.5}
				textAnchor='middle'
				fontFamily={MONO}
				fontSize={8.5}
				fontWeight={700}
				fill='#fff'
				stroke='none'
			>
				{year ?? new Date().getFullYear()}
			</text>
			<circle cx={x + 16} cy={y} r={2} className={BG} />
			<circle cx={x + w - 16} cy={y} r={2} className={BG} />
			{DAYS.map((d) => {
				const cx = x + 8 + (d % 7) * 8;
				const cy = y + 22 + Math.floor(d / 7) * 10;
				if (d === day) {
					return (
						<circle
							key={d}
							cx={cx}
							cy={cy}
							r={3.5}
							stroke={ACCENT}
							strokeWidth={1.2}
						/>
					);
				}
				if (d < day) {
					return <Cross key={d} cx={cx} cy={cy} d={d} crossed={crossed} />;
				}
				return (
					<circle
						key={d}
						cx={cx}
						cy={cy}
						r={0.8}
						fill='currentColor'
						stroke='none'
						opacity={0.5}
					/>
				);
			})}
		</motion.g>
	);
}

function Cross({
	cx,
	cy,
	d,
	crossed,
}: {
	cx: number;
	cy: number;
	d: number;
	crossed: MotionValue<number>;
}) {
	const length = useTransform(crossed, [d, d + 1], [0, 1]);
	const opacity = useTransform(length, [0, 0.05], [0, 1]);
	return (
		<motion.path
			d={`M${cx - 2} ${cy - 2}l4 4m0-4l-4 4`}
			strokeWidth={0.9}
			style={{ pathLength: length, opacity }}
		/>
	);
}

function Line({
	y,
	children,
	accent = false,
}: {
	y: number;
	children: ReactNode;
	accent?: boolean;
}) {
	return (
		<text
			x={161}
			y={y}
			fontFamily={MONO}
			fontSize={7.5}
			stroke='none'
			fill={accent ? ACCENT : 'currentColor'}
		>
			{children}
		</text>
	);
}

// What's on the monitor in each phase, inside the 114×68 screen at (155, 117).
const screens = [
	// Racing game
	<g key='game' strokeWidth={1}>
		<path d='M155 152h114' />
		<path d='M205 152l-28 33M219 152l28 33M212 156v5M212 167v7M212 179v6' />
		<rect
			x={203}
			y={167}
			width={18}
			height={10}
			rx={2}
			className={BG}
			stroke={ACCENT}
		/>
		<path d='M170 146l10-10 8 6 12-12 10 16' />
		<Line y={127} accent>
			12 FPS
		</Line>
	</g>,
	// Wi-Fi cracking
	<g key='wifi'>
		<Line y={130}>$ airmon-ng start wlan0</Line>
		<Line y={142}>$ aircrack-ng cap.cap</Line>
		<Line y={156}>[00:14:22] 7 keys tested</Line>
		<Line y={172} accent>
			KEY FOUND!
		</Line>
	</g>,
	// Torrent downloads
	<g key='torrents'>
		{['movies', 'tv shows', 'courses'].map((label, i) => (
			<g key={label}>
				<Line y={130 + i * 19}>{label}</Line>
				<rect
					x={161}
					y={133 + i * 19}
					width={100}
					height={4}
					rx={2}
					strokeWidth={0.75}
				/>
				<motion.rect
					x={161}
					y={133 + i * 19}
					width={100}
					height={4}
					rx={2}
					fill={ACCENT}
					stroke='none'
					style={{ originX: 0 }}
					initial={{ scaleX: 0.1 }}
					animate={{ scaleX: 1 }}
					transition={{
						duration: 3 + i,
						repeat: Number.POSITIVE_INFINITY,
						ease: 'linear',
					}}
				/>
			</g>
		))}
	</g>,
	// Containers
	<g key='containers'>
		<Line y={130}>$ docker ps</Line>
		{[0, 1, 2, 3, 4, 5].map((i) => (
			<g
				key={i}
				transform={`translate(${161 + (i % 3) * 34} ${137 + Math.floor(i / 3) * 22})`}
			>
				<rect width={30} height={17} rx={1.5} strokeWidth={1} />
				<circle cx={6} cy={8.5} r={1.5} fill={ACCENT} stroke='none' />
				<path d='M11 8.5h14' strokeWidth={1} />
			</g>
		))}
	</g>,
	// Go code
	<g key='go'>
		<Line y={130} accent>
			package main
		</Line>
		<Line y={146}>func main() {'{'}</Line>
		<Line y={160}>{'  '}fmt.Println("hi")</Line>
		<Line y={174}>{'}'}</Line>
	</g>,
	// Open source
	<g key='now'>
		<Line y={130}>$ git push origin main</Line>
		<rect x={161} y={138} width={52} height={15} rx={7.5} stroke={ACCENT} />
		<text
			x={187}
			y={148.5}
			textAnchor='middle'
			fontFamily={MONO}
			fontSize={7.5}
			stroke='none'
			fill={ACCENT}
		>
			merged
		</text>
		<Line y={172}>open source, always</Line>
	</g>,
];
