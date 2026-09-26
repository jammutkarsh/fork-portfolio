import classNames from 'classnames';
import PageContainer from './components/layouts/page-container';
import { getStory } from './components/story/get-story';
import PhaseProse from './components/story/phase-prose';
import StoryList from './components/story/story-list';
import VisionBoard from './components/story/vision-board';
import { merryWeather } from './fonts';
import siteMetadata from './site-metadata';

export default function Home() {
	const { phases } = getStory();
	const prose = phases.map((phase) => (
		<PhaseProse key={phase.id} source={phase.body} />
	));

	return (
		<PageContainer>
			<section className='flex min-h-[calc(100svh-12rem)] flex-col justify-center space-y-6'>
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
				<a
					href='#story'
					className='underline-magical inline-block self-start text-base md:text-lg'
				>
					How I got here &darr;
				</a>
			</section>

			<section
				id='story'
				aria-labelledby='story-title'
				className='scroll-mt-16'
			>
				<h2
					id='story-title'
					className={classNames(
						'mb-10 text-3xl font-bold md:text-5xl',
						merryWeather.className,
					)}
				>
					How I got here
				</h2>
				<VisionBoard
					phases={phases.map(({ body, ...meta }) => meta)}
					prose={prose}
					list={<StoryList phases={phases} prose={prose} />}
				/>
			</section>
		</PageContainer>
	);
}
