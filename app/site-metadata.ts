const PRODUCTION_URL = 'https://utkarshchourasia.in';
const PRODUCTION_BRANCH = 'utkarshchourasia-in';

function getBranch(url: string) {
	// fork-portfolio-git-prod-env-urls-jammutkarshs-projects.vercel.app
	const startIndex = url.search('git-');
	const endIndex = url.search('-jammutkarshs-projects.vercel.app');
	return url.substring(startIndex + 4, endIndex);
}

function getDeploymentURL() {
	if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
		return 'http://localhost:3000';
	}
	if (getBranch(process.env.VERCEL_BRANCH_URL || '') === PRODUCTION_BRANCH) {
		return PRODUCTION_URL;
	}
	return process.env.NEXT_PUBLIC_VERCEL_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
		: PRODUCTION_URL;
}

const siteMetadata = {
	title: 'Utkarsh Chourasia',
	author: 'Utkarsh Chourasia',
	headerTitle: '@jammutkarsh',
	description: 'I build stuff in the backend.',
	bio: 'Server Side Engineer',
	language: 'en-us',
	siteUrl: getDeploymentURL(),
	siteRepo: 'https://github.com/jammutkarsh/fork-portfolio',
	siteLogo: '/static/favicons/favicon.png',
	image: '/images/avatar.jpg',
	email: 'mail@utkarshchourasia.in',
	github: 'https://github.com/jammutkarsh',
	twitter: 'https://twitter.com/jammutkarsh',
	linkedin: 'https://www.linkedin.com/in/jammutkarsh',
	locale: 'en-US',
	comment: {
		provider: 'giscus',
		giscusConfig: {
			repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
			repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID || '',
			category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || '',
			categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
			mapping: 'pathname',
			reactions: '1',
			metadata: '0',
			theme: 'light',
			darkTheme: 'transparent_dark',
			themeURL: '',
		},
	},
};

export default siteMetadata;
