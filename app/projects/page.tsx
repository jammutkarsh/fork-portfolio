import Projects from 'app/projects/projects';
import Header from '../components/header';
import PageContainer from '../components/layouts/page-container';
import { getProjects } from './utils';

export const metadata = {
	title: 'Projects',
	description: 'My Projects - Utkarsh Chourasia',
};

export default function Page() {
	return (
		<PageContainer>
			<Header title='Projects' />
			<div className='space-y-2 md:space-y-5 '>
				<p className='text-lg leading-7 text-gray-500 dark:text-gray-400'>
					Here are some of my selected projects worth sharing.
				</p>
			</div>
			<Projects projects={getProjects()} />
		</PageContainer>
	);
}
