import { ImageResponse } from '@vercel/og';
import { allBlogs } from 'contentlayer/generated';

// Image metadata
export const alt = 'Blog Post';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const dynamic = 'force-static';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = allBlogs.find((p) => p.slug === params.slug);

  const username = 'jammutkarsh';
  const title = post?.title || 'Default Title';
  const description = post?.summary || 'Default Description';
  const urlPath = `🔗 https://utkarshchourasia.in/${post?._raw.flattenedPath}`;
  const readingTime = `⏳ ${post?.readingTime.text || '5 min read'}`;
  return await new ImageResponse(
    (
      <div tw="flex flex-col h-full w-full items-center justify-center">
        <div tw="flex flex-col h-[45%] w-full pl-[3.5%] pt-[3.5%] pr-[3.5%]">
          <div tw="flex text-left text-5xl font-black">Blog Post</div>
          <div tw="flex text-left text-[42px]">{title}</div>
        </div>

        {/*Second half*/}
        <div tw="flex h-[45%] w-full pt-[3.5%] pb-[3.5%]">
          <div tw="flex w-[20%] h-full pl-[3.5%] pr-0">
            <picture>
              <img
                alt="GitHub Profile Avatar"
                width="180"
                height="180"
                src={`https://github.com/${username}.png`}
                style={{
                  borderRadius: 300,
                  border: '5px solid #AABBF1',
                }}
              />
            </picture>
          </div>
          <div tw="flex w-[80%] h-full pl-0 pr-[3.5%] text-[36px] font-bold">{description}</div>
        </div>
        {/* LowerURL */}
        <div tw="flex flex-row items-center justify-between h-[10%] w-full">
          <div tw="flex text-left text-[18px] font-bold pl-[3.5%]">{urlPath}</div>
          <div tw="flex text-right text-[18px] font-bold pr-[3.5%]">{readingTime}</div>
        </div>
      </div>
    )
  );
}
