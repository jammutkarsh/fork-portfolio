let deploymentURL = 'https://localhost:3000';

function getBranch(url: string) {
  // fork-portfolio-git-prod-env-urls-jammutkarshs-projects.vercel.app
  const startIndex = url.search('git-');
  const endIndex = url.search('-jammutkarshs-projects.vercel.app');
  return url.substring(startIndex + 4, endIndex);
}

if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
  if (getBranch(process.env.VERCEL_BRANCH_URL || '') === 'utkarshchourasia-in') {
    deploymentURL = 'https://utkarshchourasia.in';
  } else {
    deploymentURL =
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` || 'https://utkarshchourasia.in';
  }
}

const siteMetadata = {
  title: 'Utkarsh Chourasia',
  author: 'Utkarsh Chourasia',
  headerTitle: '@jammutkarsh',
  description: 'I build stuff in the backend.',
  bio: 'Server Side Engineer',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: deploymentURL,
  siteRepo: 'https://github.com/jammutkarsh/fork-portfolio',
  siteLogo: '/static/favicons/favicon.png',
  image: '/static/images/avatar.jpg',
  socialBanner: '/images/opengraph-image.png',
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
      theme: 'dark',
      darkTheme: 'transparent_dark',
      themeURL: '',
    },
  },
};

export default siteMetadata;
