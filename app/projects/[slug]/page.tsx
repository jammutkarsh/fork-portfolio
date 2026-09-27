import classNames from 'classnames';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { CustomMDX } from '../../components/mdx';
import { merryWeather } from '../../fonts';
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
	const description = project.description.split('\n\n')[0].replace(/\n/g, ' ');
	return {
		title: project.name,
		description,
		openGraph: {
			title: project.name,
			description,
			type: 'article',
			url: `/projects/${slug}`,
			images: [project.hero],
		},
		alternates: { canonical: `/projects/${slug}` },
	};
}

function Section({ label, children }: { label: string; children: ReactNode }) {
	return (
		<section className='space-y-4'>
			<h2 className='font-mono text-xs uppercase tracking-widest text-gray-500'>
				{label}
			</h2>
			{children}
		</section>
	);
}

const link =
	'inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-sm hover:border-primary-500 hover:text-primary-500 dark:border-gray-300/20 dark:hover:border-primary-500';

/** A YouTube link becomes an embed; anything else is played as a video file. */
function Demo({ src }: { src: string }) {
	const youtube = src.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
	);
	return (
		<div className='aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-black dark:border-gray-300/20'>
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

	return (
		<article className='flex flex-col gap-12'>
			<header className='space-y-5'>
				<h1
					className={classNames(
						'text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl',
						merryWeather.className,
					)}
				>
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

			<div className='relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-300/20'>
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
				<div className='-my-4'>
					<CustomMDX source={project.description} />
				</div>
			</Section>

			<Section label='Tech stack'>
				<ul className='flex flex-wrap gap-2'>
					{project.stack.map((tech) => (
						<li
							key={tech}
							className='rounded-md border border-gray-200 px-2.5 py-1 font-mono text-xs dark:border-gray-300/20'
						>
							{tech}
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
