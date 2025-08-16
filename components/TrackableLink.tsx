import React from 'react';
import Link, { LinkProps } from 'next/link';
import { trackLinkClick, trackExternalLinkClick } from '../lib/analytics';

interface TrackableLinkProps extends LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  category?: string;
  text?: string;
  isExternal?: boolean;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function TrackableLink({
  href,
  children,
  className,
  category = 'internal',
  text,
  isExternal = false,
  target,
  rel,
  onClick,
  ...rest
}: TrackableLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Get link text from children if not provided
    let linkText = text;
    if (!linkText && typeof children === 'string') {
      linkText = children;
    } else if (!linkText) {
      linkText = 'Unnamed link';
    }
    
    // Track link click
    if (isExternal) {
      trackExternalLinkClick(href.toString(), linkText);
    } else {
      trackLinkClick(href.toString(), linkText, category);
    }
    
    // Call original onClick if it exists
    if (onClick) {
      onClick(e);
    }
  };

  // For external links, use standard a tag
  if (isExternal) {
    return (
      <a 
        href={href.toString()}
        className={className}
        target={target || '_blank'} 
        rel={rel || 'noopener noreferrer'}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // For internal links, use Next.js Link
  return (
    <Link 
      href={href}
      className={className} 
      onClick={handleClick}
      target={target}
      rel={rel}
      {...rest}
    >
      {children}
    </Link>
  );
}
