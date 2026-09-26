'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { PhaseMeta } from './get-story';
import { Sticker } from './stickers';

/*
  One desk, drawn on a 400×300 grid, that changes with the story. Phases
  are referred to by index (0 = gamer … 5 = now), matching content/story.mdx.
  Wall posters are the phase's stickers, laid over the SVG as HTML.
*/

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const INK = '#1f2937';

// Sky through the window: day, late night, early morning, afternoon, dusk, day.
const skies = [
	'#7dd3fc',
	'#1e1b4b',
	'#fdba74',
	'#93c5fd',
	'#c084fc',
	'#7dd3fc',
];

const posters = [
	{ left: 40, top: 7, rotate: -6 },
	{ left: 60, top: 3, rotate: 4 },
	{ left: 80, top: 8, rotate: -3 },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function DeskScene({
	phases,
	active,
}: {
	phases: PhaseMeta[];
	active: number;
}) {
	const hasServer = active >= 3;

	return (
		<div className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-300/20'>
			<svg viewBox='0 0 400 300' className='absolute inset-0 size-full'>
				<title>My desk, changing with each phase</title>
				{/* Wall and desk */}
				<rect
					width={400}
					height={212}
					className='fill-stone-100 dark:fill-stone-900'
				/>
				<rect
					y={206}
					width={400}
					height={10}
					className='fill-amber-700 dark:fill-amber-800'
				/>
				<rect
					y={216}
					width={400}
					height={84}
					className='fill-amber-800 dark:fill-amber-950'
				/>

				{/* Window */}
				<rect
					x={20}
					y={14}
					width={104}
					height={82}
					rx={4}
					fill='#e7e5e4'
					stroke={INK}
					strokeWidth={3}
				/>
				<motion.rect
					x={26}
					y={20}
					width={92}
					height={70}
					initial={false}
					animate={{ fill: skies[active] }}
					transition={{ duration: 0.8 }}
				/>
				<AnimatePresence>
					{active === 1 && (
						<motion.g
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<circle cx={96} cy={40} r={10} fill='#fef9c3' />
							<circle cx={101} cy={36} r={9} fill='#1e1b4b' />
							{[
								[40, 32],
								[58, 50],
								[76, 28],
								[48, 70],
							].map(([cx, cy]) => (
								<circle
									key={`${cx}-${cy}`}
									cx={cx}
									cy={cy}
									r={1.5}
									fill='#fff'
								/>
							))}
						</motion.g>
					)}
					{active !== 1 && (
						<motion.circle
							key='sun'
							cx={96}
							cy={42}
							r={9}
							fill='#fde047'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						/>
					)}
				</AnimatePresence>
				<path d='M72 20v70M26 55h92' stroke={INK} strokeWidth={3} />

				{/* Shelf */}
				<rect
					x={14}
					y={160}
					width={122}
					height={7}
					rx={2}
					className='fill-amber-700 dark:fill-amber-800'
				/>

				<Appear show={active >= 1}>
					{/* Router */}
					<rect
						x={54}
						y={146}
						width={36}
						height={14}
						rx={3}
						fill='#374151'
						stroke={INK}
						strokeWidth={2}
					/>
					<path
						d='M60 146l-4-16M84 146l4-16'
						stroke={INK}
						strokeWidth={3}
						strokeLinecap='round'
					/>
					<circle
						cx={64}
						cy={153}
						r={2}
						fill='#22c55e'
						className='motion-safe:animate-pulse'
					/>
					<circle cx={72} cy={153} r={2} fill='#22c55e' />
				</Appear>

				{/* Old PC: on the desk until college, then it becomes the home server */}
				<motion.g
					initial={false}
					animate={
						hasServer
							? { x: 98, y: 104, scale: 0.7 }
							: { x: 312, y: 128, scale: 1 }
					}
					transition={{ duration: 0.9, ease }}
					style={{ originX: 0, originY: 0 }}
				>
					<rect
						width={46}
						height={80}
						rx={4}
						fill='#e7e5e4'
						stroke={INK}
						strokeWidth={3}
					/>
					<rect x={8} y={10} width={30} height={6} rx={1} fill='#a8a29e' />
					<rect x={8} y={22} width={30} height={6} rx={1} fill='#a8a29e' />
					<circle
						cx={23}
						cy={62}
						r={5}
						fill='none'
						stroke={INK}
						strokeWidth={2}
					/>
					<circle
						cx={38}
						cy={72}
						r={2.5}
						fill={hasServer ? '#22c55e' : '#f97316'}
						className={hasServer ? 'motion-safe:animate-pulse' : undefined}
					/>
				</motion.g>

				<Appear show={active >= 2}>
					{/* Hard drives */}
					{[0, 1, 2].map((i) => (
						<g key={i} transform={`translate(${70 + i * 3} ${196 - i * 11})`}>
							<rect
								width={48}
								height={10}
								rx={2}
								fill='#9ca3af'
								stroke={INK}
								strokeWidth={2}
							/>
							<circle cx={42} cy={5} r={1.5} fill='#22c55e' />
						</g>
					))}
				</Appear>

				{/* Plant: one more leaf per phase */}
				<g>
					<motion.line
						x1={34}
						y1={142}
						x2={34}
						initial={false}
						animate={{ y2: 130 - active * 11 }}
						stroke='#15803d'
						strokeWidth={3}
						strokeLinecap='round'
						transition={{ duration: 0.8, ease }}
					/>
					{phases.map((phase, i) => (
						<motion.ellipse
							key={phase.id}
							cx={i % 2 ? 42 : 26}
							cy={134 - i * 11}
							rx={8}
							ry={4}
							fill='#22c55e'
							stroke='#15803d'
							strokeWidth={1.5}
							transform={`rotate(${i % 2 ? -25 : 25} ${i % 2 ? 42 : 26} ${134 - i * 11})`}
							initial={false}
							animate={{
								opacity: i <= active ? 1 : 0,
								scale: i <= active ? 1 : 0,
							}}
							transition={{ duration: 0.5, delay: 0.3 }}
						/>
					))}
					<path
						d='M22 140h24l-3 18H25z'
						fill='#c2410c'
						stroke={INK}
						strokeWidth={2.5}
						strokeLinejoin='round'
					/>
				</g>

				{/* Monitor */}
				<rect x={210} y={190} width={16} height={14} fill='#4b5563' />
				<rect
					x={190}
					y={202}
					width={56}
					height={6}
					rx={2}
					fill='#4b5563'
					stroke={INK}
					strokeWidth={2}
				/>
				<rect
					x={148}
					y={106}
					width={140}
					height={86}
					rx={6}
					fill='#374151'
					stroke={INK}
					strokeWidth={3}
				/>
				<rect x={155} y={113} width={126} height={72} fill='#0b1120' />
				<AnimatePresence mode='wait' initial={false}>
					<motion.g
						key={active}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						{screens[active]}
					</motion.g>
				</AnimatePresence>

				<Appear show={active >= 3}>
					{/* Laptop takes the old PC's spot */}
					<rect
						x={308}
						y={160}
						width={72}
						height={44}
						rx={4}
						fill='#d1d5db'
						stroke={INK}
						strokeWidth={2.5}
					/>
					<rect x={314} y={166} width={60} height={32} fill='#0b1120' />
					<text x={318} y={180} fontFamily={MONO} fontSize={7} fill='#22c55e'>
						~ ssh home
					</text>
					<text x={318} y={192} fontFamily={MONO} fontSize={7} fill='#22d3ee'>
						connected
					</text>
					<path
						d='M300 204h88l-6 6h-76z'
						fill='#e5e7eb'
						stroke={INK}
						strokeWidth={2.5}
						strokeLinejoin='round'
					/>
				</Appear>

				<Appear show={active >= 4}>
					{/* Gopher plush sitting on the monitor */}
					<g transform='translate(250 82)'>
						<ellipse
							cx={14}
							cy={16}
							rx={13}
							ry={14}
							fill='#c4a484'
							stroke={INK}
							strokeWidth={2}
						/>
						<circle
							cx={9}
							cy={12}
							r={4}
							fill='#fff'
							stroke={INK}
							strokeWidth={1}
						/>
						<circle
							cx={19}
							cy={12}
							r={4}
							fill='#fff'
							stroke={INK}
							strokeWidth={1}
						/>
						<circle cx={10} cy={13} r={1.8} fill={INK} />
						<circle cx={18} cy={13} r={1.8} fill={INK} />
						<rect
							x={12}
							y={19}
							width={4}
							height={4}
							fill='#fff'
							stroke={INK}
							strokeWidth={0.8}
						/>
					</g>
				</Appear>

				<Appear show={active >= 5}>
					{/* Coffee, because corporate */}
					<rect
						x={126}
						y={190}
						width={16}
						height={18}
						rx={2}
						fill='#de1d8d'
						stroke={INK}
						strokeWidth={2}
					/>
					<path
						d='M142 194a5 5 0 0 1 0 10'
						fill='none'
						stroke={INK}
						strokeWidth={2}
					/>
					<path
						d='M131 186c0-4 3-4 3-8M137 186c0-4 3-4 3-8'
						fill='none'
						stroke='#9ca3af'
						strokeWidth={1.5}
						strokeLinecap='round'
						className='motion-safe:animate-pulse'
					/>
				</Appear>
			</svg>

			{/* Wall posters: the current phase's stickers */}
			<AnimatePresence mode='popLayout' initial={false}>
				{phases[active].stickers.map((id, i) => (
					<motion.div
						key={id}
						className='absolute w-[15%]'
						style={{ left: `${posters[i].left}%`, top: `${posters[i].top}%` }}
						initial={{ opacity: 0, scale: 1.5, rotate: posters[i].rotate + 20 }}
						animate={{ opacity: 1, scale: 1, rotate: posters[i].rotate }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{
							type: 'spring',
							stiffness: 260,
							damping: 22,
							delay: i * 0.08,
						}}
					>
						<Sticker id={id} className='h-auto w-full' />
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}

function Appear({ show, children }: { show: boolean; children: ReactNode }) {
	return (
		<AnimatePresence initial={false}>
			{show && (
				<motion.g
					initial={{ opacity: 0, y: -12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -12 }}
					transition={{ duration: 0.5, ease }}
				>
					{children}
				</motion.g>
			)}
		</AnimatePresence>
	);
}

function Line({
	y,
	children,
	fill = '#22c55e',
}: {
	y: number;
	children: ReactNode;
	fill?: string;
}) {
	return (
		<text x={162} y={y} fontFamily={MONO} fontSize={8} fill={fill}>
			{children}
		</text>
	);
}

// What's on the monitor in each phase, drawn inside the 126×72 screen at (155, 113).
const screens: ReactNode[] = [
	// Racing game
	<g key='game'>
		<rect x={155} y={113} width={126} height={36} fill='#38bdf8' />
		<rect x={155} y={149} width={126} height={36} fill='#16a34a' />
		<path d='M206 149h24l30 36h-84z' fill='#4b5563' />
		<path d='M218 152v6M218 164v8M218 178v7' stroke='#fff' strokeWidth={2} />
		<rect
			x={206}
			y={166}
			width={22}
			height={12}
			rx={2}
			fill='#ef4444'
			stroke={INK}
			strokeWidth={1.5}
		/>
		<text
			x={160}
			y={123}
			fontFamily={MONO}
			fontSize={8}
			fontWeight={700}
			fill='#facc15'
		>
			12 FPS
		</text>
	</g>,
	// Wi-Fi cracking
	<g key='wifi'>
		<Line y={126}>$ airmon-ng start wlan0</Line>
		<Line y={138}>$ aircrack-ng cap.cap</Line>
		<Line y={152} fill='#9ca3af'>
			[00:14:22] 7 keys tested
		</Line>
		<text
			x={162}
			y={170}
			fontFamily={MONO}
			fontSize={9}
			fontWeight={700}
			fill='#facc15'
			className='motion-safe:animate-pulse'
		>
			KEY FOUND!
		</text>
	</g>,
	// Torrent downloads
	<g key='torrents'>
		{['movies', 'tv shows', 'courses'].map((label, i) => (
			<g key={label}>
				<Line y={128 + i * 20} fill='#d1d5db'>
					{label}
				</Line>
				<rect
					x={162}
					y={131 + i * 20}
					width={110}
					height={5}
					rx={2}
					fill='#1f2937'
				/>
				<motion.rect
					x={162}
					y={131 + i * 20}
					width={110}
					height={5}
					rx={2}
					fill='#22c55e'
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
		<Line y={126}>$ docker ps</Line>
		{['#de1d8d', '#facc15', '#22d3ee', '#22c55e', '#8b5cf6', '#f97316'].map(
			(color, i) => (
				<g
					key={color}
					transform={`translate(${164 + (i % 3) * 38} ${134 + Math.floor(i / 3) * 24})`}
				>
					<rect
						width={32}
						height={18}
						rx={2}
						fill={color}
						stroke={INK}
						strokeWidth={1.5}
					/>
					<text
						x={16}
						y={12}
						textAnchor='middle'
						fontFamily={MONO}
						fontSize={7}
						fill={INK}
					>
						up
					</text>
				</g>
			),
		)}
	</g>,
	// Go code
	<g key='go'>
		<Line y={126} fill='#c084fc'>
			package main
		</Line>
		<Line y={142} fill='#60a5fa'>
			func main() {'{'}
		</Line>
		<Line y={156} fill='#e5e7eb'>
			{'  '}fmt.Println("hi")
		</Line>
		<Line y={170} fill='#60a5fa'>
			{'}'}
		</Line>
	</g>,
	// Open source
	<g key='now'>
		<Line y={126}>$ git push origin main</Line>
		<rect x={162} y={134} width={70} height={18} rx={9} fill='#8b5cf6' />
		<text
			x={197}
			y={146}
			textAnchor='middle'
			fontFamily={MONO}
			fontSize={9}
			fontWeight={700}
			fill='#fff'
		>
			merged
		</text>
		<Line y={170} fill='#f472b6'>
			♥ open source
		</Line>
	</g>,
];
