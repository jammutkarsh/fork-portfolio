import fs from 'node:fs/promises';
import path from 'node:path';

/** Reads an image from `public/images` as a data URL for `next/og`. */
export async function loadBackground(file: string): Promise<string> {
	const data = await fs.readFile(
		path.join(process.cwd(), 'public/images', file),
	);
	return `data:image/png;base64,${data.toString('base64')}`;
}
