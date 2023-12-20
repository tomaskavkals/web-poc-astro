import React from "react";

import type { FunctionComponent, HTMLProps } from "react";

interface LinkProps extends HTMLProps<HTMLAnchorElement> {
  url?: string;
  trackClick?: (el: HTMLAnchorElement) => void;
}

const Link: FunctionComponent<LinkProps> = ({
  url,
  trackClick,
  onClick,
  children,
  ...rest
}) => {
  const handleTrackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackClick && trackClick(e.currentTarget);
  };

  return (
    <a href={url} onClick={handleTrackClick} {...rest}>
      {children}
    </a>
  );
};

export default Link;
