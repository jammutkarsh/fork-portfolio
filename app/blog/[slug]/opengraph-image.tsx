import { ImageResponse } from 'next/og';
import { loadBackground } from '../og-background';
import { getPosts } from '../utils';

export const alt = 'Blog Post';
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = 'image/png';

export function generateStaticParams() {
	return getPosts().map((post) => ({ slug: post.slug }));
}

function formatISODate(value: string | undefined) {
	const date = value ? new Date(value) : new Date();
	const day = date.getDate();
	const month = date.toLocaleString('en-US', { month: 'short' });
	return `${day} ${month} ${date.getFullYear()}`;
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPosts().find((p) => p.slug === slug);

	const title = post?.metadata.title || 'Tech Blogs of Utkarsh Chourasia';
	const publishDate = formatISODate(post?.metadata.publishedAt);
	const readingTime = post?.readingTime || '5 min read';
	const backgroundImage = await loadBackground('blogSlugBackgroundImage.png');
	const fontSize = title.length > 100 ? 64 : 96;

	return new ImageResponse(
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: '100% 100%',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					color: '#000000',
					fontFamily: 'sans-serif',
				}}
			>
				<div
					style={{
						display: 'flex',
						fontSize: '32px',
						padding: '50px 0 30px 0',
					}}
				>
					<span>{`${publishDate} | ${readingTime}`}</span>
				</div>
				<div
					style={{
						display: 'flex',
						fontSize: `${fontSize}px`,
						flexWrap: 'wrap',
						justifyContent: 'center',
						padding: '30px 40px 200px 40px',
					}}
				>
					<span style={{ textAlign: 'center' }}>{title}</span>
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
