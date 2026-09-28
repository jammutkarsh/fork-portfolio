import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import JsonLd from '../../components/json-ld';
import { CustomMDX } from '../../components/mdx';
import { tagBadge } from '../../components/tag';
import { createMetadata } from '../../lib/create-metadata';
import siteMetadata from '../../site-metadata';
import { getProject, getProjects } from '../utils';
import InstallCommand from './install-command';
import MermaidDiagram from './mermaid-diagram';
import ScreenshotGallery from './screenshot-gallery';

export const dynamicParams = false;

export function generateStaticParams() {
	return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await props.params;
	const project = getProject(slug);
	if (!project) return {};

	return createMetadata({
		title: project.name,
		description: project.summary,
		path: `/projects/${slug}`,
		type: 'article',
	});
}

function Section({ label, children }: { label: string; children: ReactNode }) {
	return (
		<section className='space-y-4'>
			<h2 className='border-b border-dashed border-(--ds-border-strong) pb-2 font-mono text-xs tracking-widest text-(--ds-text-secondary) uppercase'>
				{label}
			</h2>
			{children}
		</section>
	);
}

const link = 'btn';

/** A YouTube link becomes an embed; anything else is played as a video file. */
function Demo({ src }: { src: string }) {
	const youtube = src.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
	);
	return (
		<div className='aspect-video w-full overflow-hidden rounded-(--ds-radius-lg) border border-(--ds-border) bg-black'>
			{youtube ? (
				<iframe
					src={`https://www.youtube-nocookie.com/embed/${youtube[1]}`}
					title='Demo video'
					allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen
					className='size-full'
				/>
			) : (
				// biome-ignore lint/a11y/useMediaCaption: demo videos have no captions track
				<video src={src} controls preload='metadata' className='size-full' />
			)}
		</div>
	);
}

export default async function ProjectPage(props: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await props.params;
	const project = getProject(slug);
	if (!project) notFound();

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.name,
		description: project.summary,
		url: `${siteMetadata.siteUrl}/projects/${slug}`,
		codeRepository: project.repo,
		author: {
			'@type': 'Person',
			name: siteMetadata.author,
		},
		keywords: project.stack.join(', '),
	};

	return (
		<article className='flex flex-col gap-12'>
			<JsonLd data={jsonLd} />
			<header className='space-y-5'>
				<h1 className='text-3xl leading-tight font-light tracking-[-0.04em] sm:text-4xl lg:text-5xl'>
					{project.name}
				</h1>
				<div className='flex flex-wrap gap-3'>
					<a
						href={project.repo}
						target='_blank'
						rel='noreferrer'
						className={link}
					>
						Repository ↗
					</a>
					{project.website && (
						<a
							href={project.website}
							target='_blank'
							rel='noreferrer'
							className={link}
						>
							Website ↗
						</a>
					)}
				</div>
				{project.install && <InstallCommand command={project.install} />}
			</header>

			<div className='relative aspect-[16/10] w-full overflow-hidden rounded-(--ds-radius-lg) border border-(--ds-border)'>
				<Image
					src={project.hero}
					alt={`${project.name}`}
					fill
					priority
					sizes='(min-width: 1024px) 55rem, 100vw'
					className='object-cover object-top'
				/>
			</div>

			<Section label='Problem'>
				<div className='ds-prose'>
					<CustomMDX source={project.description} />
				</div>
			</Section>

			<Section label='Tech stack'>
				<ul className='flex flex-wrap gap-2'>
					{project.stack.map((tech) => (
						<li key={tech} className={tagBadge(tech)}>
							{tech.toLowerCase()}
						</li>
					))}
				</ul>
			</Section>

			{project.demo && (
				<Section label='Demo'>
					<Demo src={project.demo} />
				</Section>
			)}

			{project.screenshots?.length ? (
				<Section label='Screenshots'>
					<ScreenshotGallery screenshots={project.screenshots} />
				</Section>
			) : null}

			{project.architecture && (
				<Section label='Architecture'>
					<MermaidDiagram source={project.architecture} />
				</Section>
			)}
		</article>
	);
}
