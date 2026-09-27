import { getStory } from './components/story/get-story';
import PhaseProse from './components/story/phase-prose';
import StoryDeck from './components/story/story-deck';
import siteMetadata from './site-metadata';

export default function Home() {
	const { phases } = getStory();

	return (
		<main className='w-full flex-1'>
			<StoryDeck
				title={siteMetadata.title}
				avatar={siteMetadata.image}
				bio={`${siteMetadata.bio}. ${siteMetadata.description} I write about Linux, Go, self-hosting and open source.`}
				phases={phases.map(({ body, ...meta }) => meta)}
				prose={phases.map((phase) => (
					<PhaseProse key={phase.id} source={phase.body} />
				))}
			/>
		</main>
	);
}
