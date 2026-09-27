'use client';

import { Command } from 'cmdk';
import { useLenis } from 'lenis/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import siteMetadata from '../site-metadata';
import { terminalPath } from './layouts/terminal-path';
import { switchTheme } from './layouts/theme-switch/switch-theme';

const OPEN_EVENT = 'open-command-menu';

/** Opens the command menu from anywhere (e.g. the navbar button). */
export function openCommandMenu() {
	window.dispatchEvent(new Event(OPEN_EVENT));
}

export interface CommandMenuPost {
	slug: string;
	title: string;
}

const pages = [
	{ href: '/', title: 'Home' },
	{ href: '/blog', title: 'Blog' },
	{ href: '/projects', title: 'Projects' },
	{ href: '/uses', title: 'Uses' },
];

const socials = [
	{ href: siteMetadata.github, title: 'github' },
	{ href: siteMetadata.linkedin, title: 'linkedin' },
	{ href: siteMetadata.twitter, title: 'x' },
	{ href: `mailto:${siteMetadata.email}`, title: 'email' },
];

export default function CommandMenu({ posts }: { posts: CommandMenuPost[] }) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const cwd = terminalPath(usePathname());
	const { resolvedTheme, setTheme } = useTheme();
	const lenis = useLenis();

	// Lenis smooth-scroll hijacks wheel events page-wide; pause it while the
	// menu is open so the page behind stays put.
	useEffect(() => {
		if (open) {
			lenis?.stop();
		} else {
			lenis?.start();
		}
	}, [open, lenis]);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setOpen((value) => !value);
			}
		};
		const onOpen = () => setOpen(true);
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener(OPEN_EVENT, onOpen);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener(OPEN_EVENT, onOpen);
		};
	}, []);

	const run = useCallback((action: () => void) => {
		setOpen(false);
		action();
	}, []);

	const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

	// A terminal window (utc-ds .terminal): the title bar and the prompt show
	// the current page as a path, and entries read like paths or commands.
	return (
		<Command.Dialog
			open={open}
			onOpenChange={setOpen}
			label='Command menu'
			overlayClassName='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
			contentClassName='fixed left-1/2 top-[15vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-(--ds-radius-lg) border border-(--ds-border-strong) bg-(--ds-bg-code) font-mono text-(--ds-text-primary)'
		>
			<div className='flex items-center gap-1.5 border-b border-(--ds-border) bg-(--ds-bg-secondary) px-3 py-2'>
				<span className='size-2 bg-(--ds-danger)' />
				<span className='size-2 bg-(--ds-warning)' />
				<span className='size-2 bg-(--ds-success)' />
				<span className='ml-2 truncate text-xs text-(--ds-text-secondary)'>
					{cwd}
				</span>
			</div>
			<div className='flex items-center gap-2 border-b border-(--ds-border) px-4 py-3 text-sm'>
				<span className='max-w-[60%] shrink-0 truncate select-none'>
					<span className='text-primary-500'>{cwd}</span>
					<span className='text-(--ds-success)'> $</span>
				</span>
				<Command.Input
					placeholder='type a command or search…'
					className='min-w-0 flex-1 bg-transparent outline-none placeholder:text-(--ds-text-tertiary)'
				/>
			</div>
			<Command.List
				data-lenis-prevent
				className='max-h-[min(19rem,60vh)] overflow-y-auto overscroll-contain p-2'
			>
				<Command.Empty className='py-6 text-center text-sm text-(--ds-text-secondary)'>
					command not found
				</Command.Empty>

				<Group heading='cd'>
					{pages.map(({ href, title }) => (
						<Item
							key={href}
							value={`${title} ${terminalPath(href)}`}
							onSelect={() => run(() => router.push(href))}
						>
							{terminalPath(href)}
						</Item>
					))}
				</Group>

				{posts.length > 0 && (
					<Group heading='posts'>
						{posts.map((post) => (
							<Item
								key={post.slug}
								value={`${post.title} ${post.slug}`}
								onSelect={() => run(() => router.push(`/blog/${post.slug}`))}
							>
								<span className='truncate'>{post.title}</span>
								<span className='ml-auto hidden shrink-0 pl-4 text-xs text-(--ds-text-tertiary) sm:inline'>
									{terminalPath(`/blog/${post.slug}`)}
								</span>
							</Item>
						))}
					</Group>
				)}

				<Group heading='open'>
					{socials.map(({ href, title }) => (
						<Item
							key={title}
							value={`open ${title}`}
							onSelect={() =>
								run(() => window.open(href, '_blank', 'noopener,noreferrer'))
							}
						>
							open {title}
						</Item>
					))}
				</Group>

				<Group heading='theme'>
					<Item
						value={`theme ${nextTheme} switch`}
						onSelect={() => run(() => switchTheme(() => setTheme(nextTheme)))}
					>
						theme --{nextTheme}
					</Item>
				</Group>
			</Command.List>
		</Command.Dialog>
	);
}

function Group({
	heading,
	children,
}: {
	heading: string;
	children: ReactNode;
}) {
	return (
		<Command.Group
			heading={heading}
			className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-(--ds-text-tertiary) [&_[cmdk-group-heading]]:before:content-["#_"]'
		>
			{children}
		</Command.Group>
	);
}

function Item(props: ComponentProps<typeof Command.Item>) {
	return (
		<Command.Item
			{...props}
			className='flex cursor-pointer items-center rounded-(--ds-radius) px-2 py-1.5 text-sm before:mr-2 before:text-(--ds-text-tertiary) before:content-[">"] data-[selected=true]:bg-(--ds-primary-muted) data-[selected=true]:text-primary-500'
		/>
	);
}
