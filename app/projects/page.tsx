import Projects from 'app/projects/projects';
import Header from '../components/header';
import JsonLd from '../components/json-ld';
import PageContainer from '../components/layouts/page-container';
import { createMetadata } from '../lib/create-metadata';
import siteMetadata from '../site-metadata';
import { getProjects } from './utils';

const description =
	'A selection of backend tools, self-hosted services and open-source projects built and maintained by Utkarsh Chourasia.';

export const metadata = createMetadata({
	title: 'Projects',
	description,
	path: '/projects',
});

export default function Page() {
	const projects = getProjects();

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `Projects | ${siteMetadata.title}`,
		description,
		url: `${siteMetadata.siteUrl}/projects`,
		mainEntity: projects.map((project) => ({
			'@type': 'CreativeWork',
			name: project.name,
			url: `${siteMetadata.siteUrl}/projects/${project.slug}`,
		})),
	};

	return (
		<PageContainer>
			<JsonLd data={jsonLd} />
			<Header title='Projects' />
			<div className='space-y-2 md:space-y-5 '>
				<p className='text-lg leading-7 text-(--ds-text-secondary)'>
					Here are some of my selected projects worth sharing.
				</p>
			</div>
			<Projects projects={projects} />
		</PageContainer>
	);
}
