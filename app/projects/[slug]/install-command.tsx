'use client';

import { useState } from 'react';

/** An install command with a copy button. */
export default function InstallCommand({ command }: { command: string }) {
	const [copied, setCopied] = useState(false);

	return (
		<div className='flex items-center gap-3 rounded-(--ds-radius) border border-(--ds-border) bg-(--ds-bg-code) py-1.5 pr-1.5 pl-4 font-mono text-sm'>
			<code className='min-w-0 flex-1 overflow-x-auto whitespace-nowrap'>
				<span className='text-(--ds-success) select-none'>$ </span>
				{command}
			</code>
			<button
				type='button'
				onClick={async () => {
					await navigator.clipboard.writeText(command);
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				}}
				className='btn btn-ghost btn-sm'
			>
				{copied ? 'Copied' : 'Copy'}
			</button>
		</div>
	);
}
