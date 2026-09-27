'use client';

import { Command } from 'cmdk';
import { useLenis } from 'lenis/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
	type KeyboardEvent,
	useEffect,
	useMemo,
	useRef,
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

export interface CommandMenuProject {
	slug: string;
	name: string;
}

const pages = [
	{ href: '/', title: 'Home' },
	{ href: '/blogs', title: 'Blogs' },
	{ href: '/projects', title: 'Projects' },
	{ href: '/uses', title: 'Uses' },
];

const socials = [
	{ href: siteMetadata.github, title: 'github' },
	{ href: siteMetadata.linkedin, title: 'linkedin' },
	{ href: siteMetadata.twitter, title: 'x' },
	{ href: `mailto:${siteMetadata.email}`, title: 'email' },
];

/** Something the menu can run: a page (with a terminal path) or a command. */
interface Entry {
	id: string;
	label: string;
	/** Shown dimmed on the right, e.g. a post's title. */
	hint?: string;
	/** For pages: the terminal path, e.g. ~/utc/blog. */
	path?: string;
	run: () => void;
}

/**
 * Path mode (input starts with ~): every page whose path starts with what
 * is typed, in breadth-first order: the typed folder itself, then its
 * direct children, then theirs (~/utc, then blog, projects, uses, then the
 * posts and projects). Otherwise search mode: every entry whose path,
 * label or title contains the text.
 */
function complete(entries: Entry[], query: string) {
	const typed = query.trim().toLowerCase();
	if (typed.startsWith('~')) {
		const depth = (entry: Entry) => entry.path?.split('/').length ?? 0;
		return entries
			.filter((entry) => entry.path?.toLowerCase().startsWith(typed))
			.sort(
				(a, b) =>
					depth(a) - depth(b) || (a.path ?? '').localeCompare(b.path ?? ''),
			);
	}
	if (!typed) return entries;
	return entries.filter((entry) =>
		[entry.path, entry.label, entry.hint]
			.filter(Boolean)
			.some((text) => text?.toLowerCase().includes(typed)),
	);
}

/**
 * The command menu as a shell prompt. It opens with the current page's
 * path already typed (~/utc/blogs/some-post); edit it like a path, and the
 * list below autocompletes the pages under it. Tab completes to the
 * highlighted path, Enter goes there. Anything that isn't a path searches
 * pages, posts, projects and commands (open github, theme --light).
 */
export default function CommandMenu({
	posts,
	projects,
}: {
	posts: CommandMenuPost[];
	projects: CommandMenuProject[];
}) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState('');
	const input = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const cwd = terminalPath(usePathname());
	const { resolvedTheme, setTheme } = useTheme();
	const lenis = useLenis();

	// Lenis smooth-scroll hijacks wheel events page-wide; pause it while the
	// menu is open so the page behind stays put.
	useEffect(() => {
		if (open) lenis?.stop();
		else lenis?.start();
	}, [open, lenis]);

	useEffect(() => {
		const onKeyDown = (event: globalThis.KeyboardEvent) => {
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

	// Each time it opens, start from the current page's path, caret at the end.
	useEffect(() => {
		if (!open) return;
		setQuery(cwd);
		requestAnimationFrame(() => {
			const field = input.current;
			field?.setSelectionRange(field.value.length, field.value.length);
		});
	}, [open, cwd]);

	const entries = useMemo<Entry[]>(() => {
		const go = (href: string) => () => {
			setOpen(false);
			router.push(href);
		};
		const page = (href: string, hint?: string): Entry => ({
			id: href,
			label: terminalPath(href),
			hint,
			path: terminalPath(href),
			run: go(href),
		});
		const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
		return [
			...pages.map((p) => page(p.href)),
			...posts.map((post) => page(`/blogs/${post.slug}`, post.title)),
			...projects.map((project) =>
				page(`/projects/${project.slug}`, project.name),
			),
			...socials.map((social) => ({
				id: `open ${social.title}`,
				label: `open ${social.title}`,
				run: () => {
					setOpen(false);
					window.open(social.href, '_blank', 'noopener,noreferrer');
				},
			})),
			{
				id: 'theme',
				label: `theme --${nextTheme}`,
				run: () => {
					setOpen(false);
					switchTheme(() => setTheme(nextTheme));
				},
			},
		];
	}, [posts, projects, resolvedTheme, router, setTheme]);

	const matches = useMemo(() => complete(entries, query), [entries, query]);

	// Keep the first match highlighted as the list changes.
	useEffect(() => {
		setSelected(matches[0]?.id ?? '');
	}, [matches]);

	// Tab completes the input to the highlighted path, with a trailing slash
	// when there is more below it (~/utc/blogs/).
	const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Tab') return;
		event.preventDefault();
		const path = entries.find((entry) => entry.id === selected)?.path;
		if (!path) return;
		const hasChildren = entries.some((entry) =>
			entry.path?.startsWith(`${path}/`),
		);
		setQuery(hasChildren ? `${path}/` : path);
	};

	const pathMode = query.trim().startsWith('~');

	// A terminal window (utc-ds .terminal).
	return (
		<Command.Dialog
			open={open}
			onOpenChange={setOpen}
			label='Command menu'
			shouldFilter={false}
			value={selected}
			onValueChange={setSelected}
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
				<span className='shrink-0 text-(--ds-success) select-none'>$</span>
				<Command.Input
					ref={input}
					value={query}
					onValueChange={setQuery}
					onKeyDown={onInputKeyDown}
					placeholder='type a path or a command…'
					spellCheck={false}
					autoCapitalize='off'
					className='min-w-0 flex-1 bg-transparent text-primary-500 caret-(--ds-text-primary) outline-none placeholder:text-(--ds-text-tertiary)'
				/>
				<kbd className='hidden shrink-0 text-xs text-(--ds-text-tertiary) sm:inline'>
					tab ↹
				</kbd>
			</div>
			<Command.List
				data-lenis-prevent
				className='max-h-[min(19rem,60vh)] overflow-y-auto overscroll-contain p-2'
			>
				<Command.Empty className='py-6 text-center text-sm text-(--ds-text-secondary)'>
					{pathMode ? 'no such file or directory' : 'command not found'}
				</Command.Empty>
				{matches.map((entry) => (
					<Command.Item
						key={entry.id}
						value={entry.id}
						onSelect={entry.run}
						className='flex cursor-pointer items-center rounded-(--ds-radius) px-2 py-1.5 text-sm before:mr-2 before:text-(--ds-text-tertiary) before:content-[">"] data-[selected=true]:bg-(--ds-primary-muted) data-[selected=true]:text-primary-500'
					>
						<span className='min-w-0 truncate sm:shrink-0'>{entry.label}</span>
						{entry.hint && (
							<span className='ml-auto hidden min-w-0 truncate pl-4 text-xs text-(--ds-text-tertiary) sm:inline'>
								{entry.hint}
							</span>
						)}
					</Command.Item>
				))}
			</Command.List>
		</Command.Dialog>
	);
}
