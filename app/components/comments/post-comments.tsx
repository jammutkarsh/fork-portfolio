'use client';

import dynamic from 'next/dynamic';

const Giscus = dynamic(() => import('./giscus'), { ssr: false });

export default function PostComments() {
	return (
		<div id='comment'>
			<Giscus />
		</div>
	);
}
