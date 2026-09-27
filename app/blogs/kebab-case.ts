import { slug } from 'github-slugger';

export function kebabCase(text: string): string {
	return slug(text);
}
