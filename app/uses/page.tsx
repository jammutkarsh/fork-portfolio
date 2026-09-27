import path from 'node:path';
import { Fragment } from 'react';
import { readMDXFile } from '../blogs/utils';
import Header from '../components/header';
import { CustomMDX } from '../components/mdx';
import { createMetadata } from '../lib/create-metadata';
import UsesTitle from './uses-title';

const contentPath = path.join(process.cwd(), 'app', 'uses', 'content.mdx');
const { content } = readMDXFile(contentPath);

export const metadata = createMetadata({
	title: 'Uses',
	description:
		'The hardware, editor, terminal and self-hosted tools Utkarsh Chourasia uses day to day.',
	path: '/uses',
});

export default function Page() {
	return (
		<Fragment>
			<Header title='Uses' />
			<UsesTitle />
			<CustomMDX source={content} />
		</Fragment>
	);
}
