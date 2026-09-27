import Link from 'next/link';
import type { Project, ProjectModal } from './types';

interface ProjectProps {
	index: number;
	project: Project;
	setModal: (modal: ProjectModal) => void;
}

export default function ProjectItem({
	index,
	project,
	setModal,
}: ProjectProps) {
	return (
		<Link
			href={`/projects/${project.slug}`}
			onMouseEnter={() => {
				setModal({ active: true, index });
			}}
			onMouseLeave={() => {
				setModal({ active: false, index });
			}}
			className='group flex w-full items-center justify-between gap-6 border-b px-4 py-10 sm:px-10 sm:py-16'
		>
			<h2 className='text-2xl transition-transform group-hover:-translate-x-3 group-hover:scale-110 sm:text-6xl'>
				{project.name}
			</h2>
			<p className='text-right text-sm font-light transition-transform group-hover:translate-x-3 group-hover:scale-110 sm:text-lg'>
				{project.stack.slice(0, 3).join(' · ')}
			</p>
		</Link>
	);
}
