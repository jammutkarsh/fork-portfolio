import { getStory } from './components/story/get-story';
import PhaseProse from './components/story/phase-prose';
import StoryScroll from './components/story/story-scroll';
import siteMetadata from './site-metadata';

export default function Home() {
	const { phases, thesis, closing } = getStory();

	return (
		<main className='w-full flex-1 overflow-x-clip'>
			<StoryScroll
				title={siteMetadata.title}
				avatar={siteMetadata.image}
				bio={`${siteMetadata.bio}. ${siteMetadata.description} I write about Linux, Go, self-hosting and open source.`}
				thesis={thesis}
				closing={closing}
				phases={phases.map(({ body, ...meta }) => meta)}
				prose={phases.map((phase) => (
					<PhaseProse key={phase.id} source={phase.body} />
				))}
			/>
		</main>
	);
}
