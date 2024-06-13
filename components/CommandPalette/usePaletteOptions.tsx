'use client';

import { sortedBlogPost } from '@/lib/utils/contentlayer';
import { allBlogs } from 'contentlayer/generated';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import {
  HiOutlineDocumentDuplicate,
  HiOutlineHome,
  HiOutlinePencil,
  HiOutlineUser,
} from 'react-icons/hi';

type PaletteOption = {
  id: string;
  name: string;
  onSelect: (v: string) => void;
  icon?: ReactNode;
};

export default function usePaletteOptions() {
  const router = useRouter();
  const sortedPosts = sortedBlogPost(allBlogs);
  const { theme, setTheme } = useTheme();

  const generalOptions: PaletteOption[] = [
    {
      id: 'Toggle Theme',
      name: 'Toggle Theme',
      icon: theme === 'dark' ? <BsSunFill /> : <BsMoonFill />,
      onSelect: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      id: 'Copy Current URL',
      name: 'Copy Current URL',
      icon: <HiOutlineDocumentDuplicate />,
      onSelect: () => navigator.clipboard.writeText(window.location.href),
    },
  ];

  const pageOptions: PaletteOption[] = [
    { id: '/', name: 'Home', icon: <HiOutlineHome />, onSelect: (v) => router.push(v) },
    { id: '/blog', name: 'Blog', icon: <HiOutlinePencil />, onSelect: (v) => router.push(v) },
    { id: '/about', name: 'About', icon: <HiOutlineUser />, onSelect: (v) => router.push(v) },
  ];

  const blogOptions: PaletteOption[] = sortedPosts.map((post) => ({
    id: post.slug,
    name: post.title,
    onSelect: (v) => router.push(`/blog/${v}`),
  }));

  return { pageOptions, blogOptions, generalOptions };
}
