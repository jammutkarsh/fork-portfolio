import type { Metadata } from 'next';
import PostComments from '../../components/comments/post-comments';
import Tag from '../../components/tag';
import siteMetadata from '../../site-metadata';
import { formatDate, getPostFromSlug, getPosts } from '../utils';
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

	const url = `/blog/${params.slug}`;

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

	return (
		<>
			<section>
				<PageTitle>{metadata.title}</PageTitle>
				<div className='flex flex-wrap gap-2 items-center mt-2 text-sm text-neutral-600 dark:text-neutral-400'>
					<time dateTime={metadata.publishedAt}>
						{formatDate(metadata.publishedAt)}
					</time>
					<span aria-hidden>·</span>
					<span>{readingTime}</span>
				</div>
			</section>
			<article className='post-body min-w-0 break-words'>{content}</article>
			{metadata.tags.length > 0 && (
				<div className='mt-8 flex flex-wrap justify-center gap-2'>
					{metadata.tags.map((tag) => (
						<Tag key={tag} text={tag} />
					))}
				</div>
			)}
			<PostComments />
		</>
	);
}
