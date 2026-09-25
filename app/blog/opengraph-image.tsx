import { ImageResponse } from 'next/og';
import { loadBackground } from './og-background';
import { getPosts } from './utils';

export const alt = 'Tech blogs of Utkarsh Chourasia';
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
	const totalArticles = getPosts().length;
	const backgroundImage = await loadBackground('blogBackgroundImage.png');

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
					color: '#000000',
					fontSize: '46px',
					paddingTop: '450px',
					paddingBottom: '100px',
				}}
			>
				<span>{`🚀 ${totalArticles} articles written till now.`}</span>
			</div>
		</div>,
		{ ...size },
	);
}
