import fs from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import siteMetadata from '../../site-metadata';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

// utc-ds dark theme tokens (app/utc-ds.css).
const colors = {
	background: '#0a0a0a',
	border: '#333333',
	text: '#e8e8e8',
	muted: '#888888',
	primary: '#ff5f00',
};

interface OgImageOptions {
	/** Small uppercase label above the title, e.g. "Blog". */
	label: string;
	title: string;
	description?: string;
	/** Right-aligned footer text, e.g. "May 5, 2025 · 7 min read". */
	meta?: string;
	tags?: string[];
}

const fontsDir = path.join(process.cwd(), 'assets', 'fonts');
// A small copy of public/images/avatar.png; the original is too large to embed.
const avatarPath = path.join(
	process.cwd(),
	'public',
	'images',
	'avatar-og.jpg',
);

function truncate(text: string, max: number) {
	return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Renders a 1200×630 Open Graph image in the site's visual style. */
export async function renderOgImage({
	label,
	title,
	description,
	meta,
	tags = [],
}: OgImageOptions) {
	const [interLight, interMedium, monoRegular, monoMedium, avatar] =
		await Promise.all([
			fs.readFile(path.join(fontsDir, 'Inter-300.ttf')),
			fs.readFile(path.join(fontsDir, 'Inter-500.ttf')),
			fs.readFile(path.join(fontsDir, 'JetBrainsMono-400.ttf')),
			fs.readFile(path.join(fontsDir, 'JetBrainsMono-500.ttf')),
			fs.readFile(avatarPath),
		]);
	const avatarSrc = `data:image/jpeg;base64,${avatar.toString('base64')}`;
	const titleSize = title.length > 70 ? 48 : title.length > 40 ? 58 : 68;
	const siteHost = new URL(siteMetadata.siteUrl).host.startsWith('localhost')
		? 'utkarshchourasia.in'
		: new URL(siteMetadata.siteUrl).host;

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				padding: '0 80px',
				backgroundColor: colors.background,
				color: colors.text,
				fontFamily: 'Inter',
				fontWeight: 300,
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					height: '100%',
					borderLeft: `1px solid ${colors.border}`,
					borderRight: `1px solid ${colors.border}`,
				}}
			>
				{/* Top bar, like the site navbar */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						height: 88,
						padding: '0 56px',
						borderBottom: `1px solid ${colors.border}`,
					}}
				>
					<span
						style={{
							display: 'flex',
							fontFamily: 'JetBrains Mono',
							fontSize: 26,
						}}
					>
						<span style={{ color: colors.primary }}>~/</span>
						{siteMetadata.title}
					</span>
					<span
						style={{
							fontFamily: 'JetBrains Mono',
							fontSize: 22,
							color: colors.muted,
						}}
					>
						{siteHost}
					</span>
				</div>

				{/* Body */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						padding: '48px 56px 0',
					}}
				>
					<span
						style={{
							fontFamily: 'JetBrains Mono',
							fontSize: 22,
							fontWeight: 500,
							color: colors.primary,
							textTransform: 'uppercase',
							letterSpacing: 4,
						}}
					>
						{label}
					</span>
					<span
						style={{
							marginTop: 12,
							fontFamily: 'Inter',
							fontWeight: 300,
							fontSize: titleSize,
							lineHeight: 1.2,
							letterSpacing: -2,
						}}
					>
						{truncate(title, 110)}
					</span>
					<div
						style={{
							width: 120,
							height: 4,
							marginTop: 24,
							backgroundColor: colors.primary,
						}}
					/>
					{description && (
						<span
							style={{
								marginTop: 24,
								fontSize: 30,
								lineHeight: 1.4,
								color: colors.muted,
							}}
						>
							{truncate(description, 140)}
						</span>
					)}
				</div>

				{/* Footer */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 32,
						padding: '0 56px 44px',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
						{/* biome-ignore lint/performance/noImgElement: next/og renders plain img */}
						<img
							src={avatarSrc}
							alt=''
							width={56}
							height={56}
							style={{
								borderRadius: 9999,
								border: `2px solid ${colors.primary}`,
								objectFit: 'cover',
							}}
						/>
						<span style={{ fontFamily: 'JetBrains Mono', fontSize: 22 }}>
							{siteMetadata.headerTitle}
						</span>
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							fontFamily: 'JetBrains Mono',
							fontSize: 16,
						}}
					>
						{/* utc-ds badges: bracket-wrapped [tags] */}
						{tags.slice(0, 2).map((tag) => (
							<span
								key={tag}
								style={{ display: 'flex', color: colors.primary }}
							>
								<span style={{ color: colors.muted }}>[</span>
								{tag}
								<span style={{ color: colors.muted }}>]</span>
							</span>
						))}
						{meta && <span style={{ color: colors.muted }}>{meta}</span>}
					</div>
				</div>
			</div>
		</div>,
		{
			...ogSize,
			fonts: [
				{ name: 'Inter', data: interLight, weight: 300 },
				{ name: 'Inter', data: interMedium, weight: 500 },
				{ name: 'JetBrains Mono', data: monoRegular, weight: 400 },
				{ name: 'JetBrains Mono', data: monoMedium, weight: 500 },
			],
		},
	);
}
