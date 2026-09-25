import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '../components/header';
import { CustomMDX } from '../components/mdx';
import siteMetadata from '../site-metadata';

const { data, content } = matter(
	fs.readFileSync(path.join(process.cwd(), 'content/about.mdx'), 'utf-8'),
);

export const metadata: Metadata = {
	title: 'About',
	description: `About | ${siteMetadata.title}`,
	openGraph: {
		title: `About | ${siteMetadata.title}`,
		description: `About | ${siteMetadata.title}`,
		type: 'website',
		url: '/about',
	},
};

export default function AboutPage() {
	return (
		<>
			<Header title='About' />
			<div className='flex flex-col-reverse items-center gap-5 sm:flex-row'>
				<Image
					alt={data.name ?? siteMetadata.author}
					src={data.avatar ?? siteMetadata.image}
					width={150}
					height={150}
					className='rounded-full object-cover'
				/>
				<div className='text-center sm:text-left'>
					<h2 className='text-xl font-bold md:text-3xl lg:text-4xl'>
						{data.name ?? siteMetadata.author}
					</h2>
					<p className='text-sm text-gray-600 dark:text-gray-400 md:text-base'>
						{data.occupation}
					</p>
				</div>
			</div>
			<div className='text-justify'>
				<CustomMDX source={content} />
			</div>
		</>
	);
}
