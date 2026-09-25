import classNames from 'classnames';
import Link from 'next/link';
import PageContainer from './components/layouts/page-container';
import { merryWeather } from './fonts';
import siteMetadata from './site-metadata';

export default function Home() {
	return (
		<PageContainer className='justify-center'>
			<div className='-mt-16 space-y-6'>
				<h1
					className={classNames(
						'text-5xl font-bold leading-tight tracking-tight sm:text-7xl md:text-8xl',
						merryWeather.className,
					)}
				>
					{siteMetadata.title}
				</h1>
				<p className='max-w-2xl text-lg text-gray-600 dark:text-gray-400 md:text-xl'>
					{siteMetadata.bio}. {siteMetadata.description} I write about Linux,
					Go, self-hosting and open source.
				</p>
				<Link
					href='/about'
					className='underline-magical inline-block text-base md:text-lg'
				>
					Read more about me &rarr;
				</Link>
			</div>
		</PageContainer>
	);
}
