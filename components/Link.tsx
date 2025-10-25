'use client';

import { LinkButton } from '@dlarroder/playground';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

const CustomLink = ({
  href,
  ...rest
}: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/');
  const isAnchorLink = href && href.startsWith('#');

  if (isInternalLink) {
    return <LinkButton href={href} {...rest} />;
  }

  if (isAnchorLink) {
    return <LinkButton href={href} {...rest} />;
  }

  return <LinkButton target="_blank" rel="noopener noreferrer" href={href} {...rest} />;
};

export default CustomLink;
