/** The site's terminal-style home directory, shown as the nav brand. */
export const TERMINAL_HOME = '~/utc';

/**
 * A page's URL as a terminal path: `/` is `~/utc`, `/blog/some-post` is
 * `~/utc/blog/some-post`. Used by the nav brand, the command menu prompt
 * and the Open Graph images, so they always agree.
 */
export function terminalPath(pathname: string) {
	const path = pathname.replace(/\/+$/, '');
	return path ? `${TERMINAL_HOME}${path}` : TERMINAL_HOME;
}
