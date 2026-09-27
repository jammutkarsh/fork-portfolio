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
			className='group flex w-full items-center justify-between gap-6 border-b border-dashed border-(--ds-border-strong) px-4 py-10 sm:px-10 sm:py-16'
		>
			<h2 className='text-2xl font-light tracking-[-0.04em] transition-colors duration-150 group-hover:text-primary-500 sm:text-6xl'>
				{project.name}
			</h2>
			<p className='text-right font-mono text-xs text-(--ds-text-secondary) transition-colors duration-150 group-hover:text-(--ds-text-primary) sm:text-sm'>
				{project.stack.slice(0, 3).join(' · ')}
			</p>
		</Link>
	);
}
