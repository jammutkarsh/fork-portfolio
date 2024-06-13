const siteMetadata = {
  title: 'Utkarsh Chourasia',
  author: 'Utkarsh Chourasia',
  headerTitle: 'dalelarroder',
  description: 'Software Developer at TCS',
  bio: 'Server Side Engineer',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://utkarshchourasia.in',
  siteRepo: 'https://github.com/jammutkarsh/fork-portfolio',
  siteLogo: '/static/images/logo.png',
  image: '/static/images/avatar.jpg',
  socialBanner: '/static/images/twitter-card.png',
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
