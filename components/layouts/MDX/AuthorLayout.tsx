import Image from '@/components/Image';
import siteMetadata from '@/content/siteMetadata';
import type { Authors } from 'contentlayer/generated';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  content: Omit<Authors, '_id' | '_raw' | 'body'>;
}

export default function AuthorLayout({ children, content }: Props) {
  const { avatar, occupation, company } = content;

  return (
    <div className="pt-8">
      <div className="mb-8 flex flex-col-reverse items-center sm:flex-row sm:items-center">
        <div>
          <Image
            alt={siteMetadata.title}
            height={150}
            width={150}
            src={avatar || ''}
            className="rounded-full  mr-5 mt-5"
          />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold md:text-3xl lg:text-4xl">{siteMetadata.title}</h1>
          <h3 className="text-sm font-normal md:text-base">
            {occupation} <span className="font-semibold">{company}</span>
          </h3>
        </div>
      </div>
      <div className="prose max-w-none pb-8 text-justify text-sm dark:prose-dark md:text-lg xl:col-span-2">
        {children}
      </div>
    </div>
  );
}
