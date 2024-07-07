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

export default async function Image({ params }: { params: { slug: string } }) {
  const post = allBlogs.find((p) => p.slug === params.slug);

  const title = post?.title || 'Tech Blogs of Utkarsh Chourasia';
  const publishDate = formatISODate(post?.date);
  const readingTime = `${post?.readingTime.text || '5 min read'}`;
  const SlugbackgroundImage =
    'https://raw.githubusercontent.com/jammutkarsh/fork-portfolio/utkarshchourasia-in/public/images/blogSlugBackgroundImage.png';

  let fontSize = 96; // Base font size
  if (title.length > 100) {
    fontSize = 64;
  }

  return await new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundImage: `url(${SlugbackgroundImage})`,
          backgroundSize: '100% 100%',
        }}
      >
        <div
          className={firaSans.className}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#000000',
          }}
        >
          {/* <----------------------- DATE | TIME -----------------------> */}
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              padding: '50px 0 30px 0',
            }}
          >
            <span>
              {publishDate} | {readingTime}
            </span>
          </div>
          {/* <----------------------- TITLE -----------------------> */}
          <div
            style={{
              display: 'flex',
              fontSize: `${fontSize}px`,
              flexWrap: 'wrap',
              justifyContent: 'center',
              padding: '30px 40px 200px 40px',
            }}
          >
            <span style={{ textAlign: 'center' }}>{title}</span>
          </div>
        </div>
      </div>
    )
  );
}

function formatISODate(ISOString: string | undefined | number | Date) {
  const date = ISOString === undefined ? new Date() : new Date(ISOString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
