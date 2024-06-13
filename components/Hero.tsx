'use client';

import Link from 'next/link';
import { ReactElement, useRef } from 'react';
import siteMetadata from 'content/siteMetadata';

export default function Hero(): ReactElement {
  const ref = useRef<HTMLHeadingElement>(null);

  return (
    <div>
      <h1 className="sr-only">
        Hello I'm {siteMetadata.title}, I'm a software developer, and I love building things for the
        web.
      </h1>
      <div className="relative z-10 flex h-[calc(100vh-81px)] items-center md:h-[calc(100vh-116px)]">
        <div className="mx-auto w-screen max-w-3xl px-4 sm:px-9 xl:max-w-5xl xl:px-0">
          <div className="-mt-36">
            <div ref={ref} className="flex cursor-default flex-col space-y-2">
              <h1 className="text-5xl font-semibold sm:text-7xl md:text-8xl xl:text-9xl">
                {siteMetadata.title}
              </h1>
              <h2 className="text-3xl font-medium opacity-80 sm:text-6xl md:text-6xl xl:text-7xl">
                I build things for the web.
              </h2>
              <Link
                href="/about"
                className="underline-magical text-md w-max cursor-pointer sm:text-lg md:text-xl xl:text-2xl"
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  zIndex: 1,
                  padding: '0.1em 0.3em',
                  margin: '-0.1em -0.3em',
                }}
              >
                Read more about me &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
      <canvas className="bg-skin-base pointer-events-none absolute inset-0" id="canvas"></canvas>
    </div>
  );
}
