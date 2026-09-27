import type { Metadata } from 'next';
import Tag from '../../components/tag';
import siteMetadata from '../../site-metadata';
import { kebabCase } from '../kebab-case';
import { formatDate, getPostFromSlug, getPosts, getTagBadges } from '../utils';
import PageTitle from './page-title';

export const dynamicParams = false;

export function generateStaticParams() {
	return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const { metadata } = await getPostFromSlug(params.slug);

	const url = `/blogs/${params.slug}`;

	return {
		title: metadata.title,
		description: metadata.summary,
		openGraph: {
			title: metadata.title,
			description: metadata.summary,
			type: 'article',
			url: url,
			publishedTime: metadata.publishedAt,
			authors: [metadata.author ?? siteMetadata.author],
			tags: metadata.tags,
		},
		twitter: {
			card: 'summary_large_image',
			title: metadata.title,
			description: metadata.summary,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function Blog(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;

	const { metadata, content, readingTime } = await getPostFromSlug(params.slug);
	const tagBadges = getTagBadges(getPosts());

	return (
		<>
			<section>
				<PageTitle>{metadata.title}</PageTitle>
				<div className='meta mt-4'>
					<time dateTime={metadata.publishedAt}>
						{formatDate(metadata.publishedAt)}
					</time>
					<span aria-hidden className='sep'>
						|
					</span>
					<span>{readingTime}</span>
				</div>
			</section>
			<article className='ds-prose min-w-0 break-words'>{content}</article>
			{metadata.tags.length > 0 && (
				<div className='mt-8 flex flex-wrap justify-center gap-2'>
					{metadata.tags.map((tag) => (
						<Tag key={tag} text={tag} badge={tagBadges[kebabCase(tag)]} />
					))}
				</div>
			)}
		</>
	);
}
