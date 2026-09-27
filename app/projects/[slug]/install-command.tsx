'use client';

import { useState } from 'react';

/** An install command with a copy button. */
export default function InstallCommand({ command }: { command: string }) {
	const [copied, setCopied] = useState(false);

	return (
		<div className='flex items-center gap-3 rounded-md border border-gray-200 py-1.5 pr-1.5 pl-4 font-mono text-sm dark:border-gray-300/20'>
			<code className='min-w-0 flex-1 overflow-x-auto whitespace-nowrap'>
				<span className='text-primary-500 select-none'>$ </span>
				{command}
			</code>
			<button
				type='button'
				onClick={async () => {
					await navigator.clipboard.writeText(command);
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				}}
				className='cursor-pointer rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'
			>
				{copied ? 'Copied' : 'Copy'}
			</button>
		</div>
	);
}
