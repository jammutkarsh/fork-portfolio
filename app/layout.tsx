import { GoogleTagManager } from '@next/third-parties/google';
import Analytics from 'app/components/analytics/analytics';
import LenisProvider from 'app/components/providers/LenisProvider';
import ThemeProvider from 'app/components/providers/ThemeProvider';
import siteMetadata from 'app/site-metadata';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { mukta } from './fonts';
import './tailwind.css';

export const metadata: Metadata = {
	title: {
		template: `%s | ${siteMetadata.title}`,
		default: siteMetadata.title,
	},
	description: siteMetadata.bio,
	creator: siteMetadata.author,
	metadataBase: new URL(siteMetadata.siteUrl),
	openGraph: {
		title: siteMetadata.title,
		siteName: siteMetadata.title,
		description: siteMetadata.bio,
		type: 'website',
		url: new URL(siteMetadata.siteUrl),
	},
};

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang='en' suppressHydrationWarning className={mukta.className}>
			<head>
				<link
					rel='apple-touch-icon'
					sizes='76x76'
					href='/static/favicons/favicon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/static/favicons/favicon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/static/favicons/favicon.png'
				/>
				<meta name='msapplication-TileColor' content='#000000' />
				<meta name='theme-color' content='#000000' />
			</head>
			<body className='bg-white text-black antialiased dark:bg-black dark:text-white selection:bg-primary-500 selection:text-white'>
				<GoogleTagManager gtmId='G-65F69D270G' />
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					themes={['dark', 'light']}
				>
					<LenisProvider>{children}</LenisProvider>
					{process.env.NODE_ENV === 'production' && <Analytics />}
				</ThemeProvider>
			</body>
		</html>
	);
}
