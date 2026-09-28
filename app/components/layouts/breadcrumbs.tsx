'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { TERMINAL_HOME } from './terminal-path';

const segment =
	'rounded-(--ds-radius-sm) px-1 -mx-1 motion-safe:transition-colors motion-safe:duration-150 hover:bg-(--ds-primary-muted) hover:text-primary-500';

/**
 * The nav brand: the current path as terminal-style breadcrumbs,
 * `~/utc / blogs / some-post`. `utc` goes home, every folder goes to its
 * page, and the last part (the page you're on) copies its link.
 */
export default function Breadcrumbs() {
	const pathname = usePathname();
	const parts = pathname.split('/').filter(Boolean);

	return (
		<nav
			aria-label='Breadcrumb'
			className='order-1 flex h-14 min-w-0 items-center font-mono text-sm font-semibold text-(--ds-text-primary) sm:h-auto'
		>
			<ol className='flex min-w-0 items-center'>
				<li className='shrink-0'>
					<Link
						href='/'
						aria-current={parts.length === 0 ? 'page' : undefined}
						className={segment}
					>
						<span className='text-primary-500'>
							{TERMINAL_HOME.slice(0, 2)}
						</span>
						{TERMINAL_HOME.slice(2)}
					</Link>
				</li>
				{parts.map((part, i) => {
					const href = `/${parts.slice(0, i + 1).join('/')}`;
					const last = i === parts.length - 1;
					return (
						<li
							key={href}
							className={`flex items-center ${last ? 'min-w-0' : 'shrink-0'}`}
						>
							<span
								aria-hidden='true'
								className='px-2 font-normal text-(--ds-text-tertiary) select-none'
							>
								/
							</span>
							{last ? (
								<CopyLink label={decode(part)} />
							) : (
								<Link href={href} className={segment}>
									{decode(part)}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

function decode(part: string) {
	try {
		return decodeURIComponent(part);
	} catch {
		return part;
	}
}

/** The page you're on: click to copy its link. */
function CopyLink({ label }: { label: string }) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	useEffect(() => () => clearTimeout(timer.current), []);

	const copy = async () => {
		const { origin, pathname } = window.location;
		try {
			await navigator.clipboard.writeText(origin + pathname);
		} catch {
			return;
		}
		setCopied(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), 1600);
	};

	return (
		<button
			type='button'
			onClick={copy}
			aria-current='page'
			title='Copy link to this page'
			className={`${segment} group flex min-w-0 cursor-copy items-center gap-1.5`}
		>
			<span className='truncate'>{label}</span>
			<span
				aria-hidden='true'
				className={`shrink-0 motion-safe:transition-opacity ${copied ? 'text-(--ds-success)' : 'opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60'}`}
			>
				{copied ? <CheckIcon /> : <LinkIcon />}
			</span>
			<span aria-live='polite' className='sr-only'>
				{copied ? 'Link copied' : ''}
			</span>
		</button>
	);
}

const iconProps = {
	viewBox: '0 0 24 24',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
	className: 'size-3.5',
} as const;

function LinkIcon() {
	return (
		<svg {...iconProps} aria-hidden='true'>
			<path d='M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5' />
			<path d='M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5' />
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg {...iconProps} aria-hidden='true'>
			<path d='M20 6 9 17l-5-5' />
		</svg>
	);
}
