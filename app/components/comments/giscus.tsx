'use client';

import siteMetadata from 'app/site-metadata';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const COMMENTS_ID = 'comments-container';

export default function Giscus() {
	const { resolvedTheme } = useTheme();
	const config = siteMetadata.comment.giscusConfig;

	useEffect(() => {
		const comments = document.getElementById(COMMENTS_ID);
		if (!comments) {
			return;
		}

		const commentsTheme =
			config.themeURL === ''
				? resolvedTheme === 'dark'
					? config.darkTheme
					: config.theme
				: config.themeURL;

		const script = document.createElement('script');
		script.src = 'https://giscus.app/client.js';
		script.setAttribute('data-repo', config.repo);
		script.setAttribute('data-repo-id', config.repositoryId);
		script.setAttribute('data-category', config.category);
		script.setAttribute('data-category-id', config.categoryId);
		script.setAttribute('data-mapping', 'title');
		script.setAttribute('data-reactions-enabled', config.reactions);
		script.setAttribute('data-emit-metadata', config.metadata);
		script.setAttribute('data-theme', commentsTheme);
		script.setAttribute('crossOrigin', 'anonymous');
		script.async = true;
		comments.appendChild(script);

		return () => {
			comments.innerHTML = '';
		};
	}, [resolvedTheme, config]);

	return (
		<div className='py-6 text-center text-gray-700 dark:text-gray-300'>
			<div className='giscus' id={COMMENTS_ID} />
		</div>
	);
}
