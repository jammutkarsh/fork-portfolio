import { Inter, JetBrains_Mono } from 'next/font/google';

// utc-ds fonts: Inter for headings and body, JetBrains Mono for code and the
// terminal-style accents. Exposed as CSS variables, which the design
// system's --ds-font-sans / --ds-font-mono tokens use (app/utc-ds.css).
export const inter = Inter({
	weight: ['300', '400', '500', '600'],
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
	weight: ['400', '500', '600'],
	variable: '--font-jetbrains-mono',
	subsets: ['latin'],
	display: 'swap',
});
