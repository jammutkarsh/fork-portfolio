'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import siteMetadata from '../site-metadata';
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
	{ href: '/about', title: 'About' },
	{ href: '/uses', title: 'Uses' },
];

const socials = [
	{ href: siteMetadata.github, title: 'GitHub' },
	{ href: siteMetadata.linkedin, title: 'LinkedIn' },
	{ href: siteMetadata.twitter, title: 'X (Twitter)' },
	{ href: `mailto:${siteMetadata.email}`, title: 'Email' },
];

export default function CommandMenu({ posts }: { posts: CommandMenuPost[] }) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const { resolvedTheme, setTheme } = useTheme();

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

	return (
		<Command.Dialog
			open={open}
			onOpenChange={setOpen}
			label='Command menu'
			overlayClassName='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm'
			contentClassName='fixed left-1/2 top-[15vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white text-black shadow-2xl dark:border-gray-800 dark:bg-neutral-950 dark:text-white'
		>
			<Command.Input
				placeholder='Type a command or search…'
				className='w-full border-b border-gray-200 bg-transparent px-4 py-3 text-base outline-none placeholder:text-gray-500 dark:border-gray-800'
			/>
			<Command.List className='max-h-[min(19rem,60vh)] overflow-y-auto overscroll-contain p-2'>
				<Command.Empty className='py-6 text-center text-sm text-gray-500'>
					No results found.
				</Command.Empty>

				<Group heading='Pages'>
					{pages.map(({ href, title }) => (
						<Item key={href} onSelect={() => run(() => router.push(href))}>
							{title}
						</Item>
					))}
				</Group>

				<Group heading='Links'>
					{socials.map(({ href, title }) => (
						<Item
							key={title}
							onSelect={() =>
								run(() => window.open(href, '_blank', 'noopener,noreferrer'))
							}
						>
							{title}
						</Item>
					))}
				</Group>

				{posts.length > 0 && (
					<Group heading='Blog posts'>
						{posts.map((post) => (
							<Item
								key={post.slug}
								value={`${post.title} ${post.slug}`}
								onSelect={() => run(() => router.push(`/blog/${post.slug}`))}
							>
								{post.title}
							</Item>
						))}
					</Group>
				)}

				<Group heading='Theme'>
					<Item
						onSelect={() =>
							run(() =>
								switchTheme(() =>
									setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
								),
							)
						}
					>
						Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} theme
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
			className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-gray-500'
		>
			{children}
		</Command.Group>
	);
}

function Item(props: ComponentProps<typeof Command.Item>) {
	return (
		<Command.Item
			{...props}
			className='cursor-pointer rounded-md px-2 py-2 text-sm data-[selected=true]:bg-primary-500/10 data-[selected=true]:text-primary-500'
		/>
	);
}
