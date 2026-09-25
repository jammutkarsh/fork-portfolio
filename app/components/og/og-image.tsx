import fs from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import siteMetadata from '../../site-metadata';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const colors = {
	background: '#000000',
	border: '#262626',
	text: '#ffffff',
	muted: '#a3a3a3',
	primary: '#de1d8d',
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
const avatarPath = path.join(process.cwd(), 'public', 'images', 'avatar.jpg');

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
	const [merriweather, muktaRegular, muktaSemiBold, avatar] = await Promise.all(
		[
			fs.readFile(path.join(fontsDir, 'Merriweather-700.ttf')),
			fs.readFile(path.join(fontsDir, 'Mukta-400.ttf')),
			fs.readFile(path.join(fontsDir, 'Mukta-600.ttf')),
			fs.readFile(avatarPath),
		],
	);
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
				fontFamily: 'Mukta',
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
					<span style={{ fontFamily: 'Merriweather', fontSize: 26 }}>
						{siteMetadata.title}
					</span>
					<span style={{ fontSize: 24, color: colors.muted }}>{siteHost}</span>
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
							fontSize: 24,
							fontWeight: 600,
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
							fontFamily: 'Merriweather',
							fontSize: titleSize,
							lineHeight: 1.25,
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
						<span style={{ fontSize: 26 }}>{siteMetadata.headerTitle}</span>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						{tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								style={{
									padding: '2px 14px',
									borderRadius: 6,
									border: `1px solid ${colors.primary}`,
									color: colors.primary,
									fontSize: 20,
									textTransform: 'uppercase',
								}}
							>
								{tag}
							</span>
						))}
						{meta && (
							<span style={{ fontSize: 24, color: colors.muted }}>{meta}</span>
						)}
					</div>
				</div>
			</div>
		</div>,
		{
			...ogSize,
			fonts: [
				{ name: 'Merriweather', data: merriweather, weight: 700 },
				{ name: 'Mukta', data: muktaRegular, weight: 400 },
				{ name: 'Mukta', data: muktaSemiBold, weight: 600 },
			],
		},
	);
}
