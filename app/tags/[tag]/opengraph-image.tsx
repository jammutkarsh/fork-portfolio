import { kebabCase } from '../../blog/kebab-case';
import { getAllTags, getPosts, getTagNames } from '../../blog/utils';
import {
	ogContentType,
	ogSize,
	renderOgImage,
} from '../../components/og/og-image';

export const alt = 'Blog posts by tag';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
	return Object.keys(getAllTags(getPosts())).map((tag) => ({ tag }));
}

export default async function Image({
	params,
}: {
	params: Promise<{ tag: string }>;
}) {
	const { tag } = await params;
	const posts = getPosts().filter((post) =>
		post.metadata.tags.map(kebabCase).includes(tag),
	);
	const name = getTagNames(posts)[tag] ?? tag;
	return renderOgImage({
		label: 'Tag',
		title: name,
		description: `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} tagged “${name}”.`,
	});
}
