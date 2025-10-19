'use client';

import React from 'react';
import { Stack, Typography, TextLink, Icon } from 'spotify-design-system';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { COOKIE_BANNER_CONFIG } from './CookieBanner.config';

interface CookieBannerProps {
  onClose?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onClose }) => {
  const { styles, content, closeButton } = COOKIE_BANNER_CONFIG;

  const containerClasses = `
    fixed bottom-0 left-0 right-0
    ${styles.background}
    ${styles.border}
    ${styles.spacing}
    z-50
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className={containerClasses} style={{ width: '100%' }}>
      <Stack direction="row" justify="space-between" spacing="md" style={{ width: '100%' }}>
        <Typography
          variant="caption"
          component="p"
          size={'sm'}
          className="leading-relaxed flex-1"
          style={{ color: styles.textColor }}
        >
          {content.text.start}{' '}
          <TextLink href={content.links.partners.href} weight="bold" underline variant={'black'}>
            {content.links.partners.text}
          </TextLink>{' '}
          {content.text.middle}{' '}
          <TextLink
            href={content.links.cookiePolicy.href}
            weight="bold"
            underline
            variant={'black'}
          >
            {content.links.cookiePolicy.text}
          </TextLink>
        </Typography>
        <Icon
          icon={faTimes}
          size="sm"
          color={styles.textColor}
          clickable
          onClick={onClose}
          aria-label={closeButton.ariaLabel}
          className="flex-shrink-0 cursor-pointer"
        />
      </Stack>
    </div>
  );
};
