import { ImageResponse } from '@vercel/og';
import { allBlogs } from 'contentlayer/generated';
import { Fira_Sans } from 'next/font/google';

// Image metadata
export const alt = 'Blog Post';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const dynamic = 'force-static';

const firaSans = Fira_Sans({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
});

export default async function Image() {
  const totalArticles = allBlogs.length;
  const publishedText = `🚀 ${totalArticles} articles written till now.`;
  const backgroundImage =
    'https://raw.githubusercontent.com/jammutkarsh/fork-portfolio/utkarshchourasia-in/public/images/blogBackgroundImage.png';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '100% 100%',
        }}
      >
        <div
          className={firaSans.className}
          style={{
            display: 'flex',
            color: '#000000',
            fontSize: '46px',
            paddingTop: `450px`,
            paddingBottom: '100px',
          }}
        >
          <span>{publishedText}</span>
        </div>
      </div>
    )
  );
}
