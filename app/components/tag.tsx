import Link from 'next/link';
import { kebabCase } from '../blog/kebab-case';

export default function Tag({ text }: { text: string }) {
	return (
		<Link
			href={`/tags/${kebabCase(text)}`}
			className='rounded-md bg-primary-500 px-2 py-0.5 text-xs uppercase text-white motion-safe:transition-colors motion-safe:duration-300 hover:bg-primary-400'
		>
			{text.split(' ').join('-')}
		</Link>
	);
}
