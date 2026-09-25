import Link from 'next/link';
import { getAllTags, getPosts, getTagNames } from '../blog/utils';
import Header from '../components/header';
import siteMetadata from '../site-metadata';

export const metadata = {
	title: 'Tags',
	description: `Tags | ${siteMetadata.title}`,
};

export default function TagsPage() {
	const posts = getPosts();
	const tags = getAllTags(posts);
	const names = getTagNames(posts);
	const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);

	return (
		<>
			<Header title='Tags' />
			<div className='flex flex-wrap gap-3'>
				{sortedTags.length === 0 && 'No tags found.'}
				{sortedTags.map((tag) => (
					<Link
						key={tag}
						href={`/tags/${tag}`}
						className='rounded-md bg-primary-500 px-3 py-1 text-sm uppercase text-white motion-safe:transition-colors motion-safe:duration-300 hover:bg-primary-400'
					>
						{names[tag]} ({tags[tag]})
					</Link>
				))}
			</div>
		</>
	);
}
