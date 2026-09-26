import Link from 'next/link';
import siteMetadata from '../../site-metadata';
import { AtSignIcon } from './icons/at-sign-icon';
import { GithubIcon } from './icons/github-icon';
import { LinkedinIcon } from './icons/linkedin-icon';
import { XIcon } from './icons/x-icon';

const socials = [
	{ href: siteMetadata.github, label: 'GitHub', Icon: GithubIcon },
	{ href: siteMetadata.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
	{ href: siteMetadata.twitter, label: 'X (Twitter)', Icon: XIcon },
	{ href: `mailto:${siteMetadata.email}`, label: 'Email', Icon: AtSignIcon },
];

export default function SiteFooter() {
	return (
		<footer className='w-full'>
			<div className='mx-auto flex w-full max-w-5xl flex-col-reverse items-center justify-between gap-3 border-x border-gray-200 px-5 py-6 text-sm text-gray-600 dark:border-gray-300/20 dark:text-gray-400 sm:flex-row sm:px-8 md:px-18'>
				<p>
					© {new Date().getFullYear()} {siteMetadata.author}. All rights
					reserved.
				</p>
				<div className='-mx-2 flex items-center'>
					{socials.map(({ href, label, Icon }) => (
						<Link
							key={label}
							href={href}
							aria-label={label}
							target={href.startsWith('mailto:') ? undefined : '_blank'}
							rel='noreferrer'
							className='hover:text-black dark:hover:text-white'
						>
							<Icon size={20} />
						</Link>
					))}
				</div>
			</div>
		</footer>
	);
}
