import type { Metadata } from 'next';
import { kebabCase } from '../../blog/kebab-case';
import { getAllTags, getPosts, getTagNames, toSummary } from '../../blog/utils';
import { BlogPosts } from '../../components/blog-posts';
import Header from '../../components/header';
import siteMetadata from '../../site-metadata';

export const dynamicParams = false;

export function generateStaticParams() {
	return Object.keys(getAllTags(getPosts())).map((tag) => ({ tag }));
}

function tagTitle(tag: string) {
	return getTagNames(getPosts())[tag] ?? tag;
}

export async function generateMetadata(props: {
	params: Promise<{ tag: string }>;
}): Promise<Metadata> {
	const { tag } = await props.params;
	return {
		title: tagTitle(tag),
		description: `Posts tagged ${tag} | ${siteMetadata.title}`,
	};
}

export default async function TagPage(props: {
	params: Promise<{ tag: string }>;
}) {
	const { tag } = await props.params;
	const posts = getPosts().filter((post) =>
		post.metadata.tags.map(kebabCase).includes(tag),
	);

	return (
		<>
			<Header title={tagTitle(tag)} />
			<BlogPosts posts={posts.map(toSummary)} />
		</>
	);
}
