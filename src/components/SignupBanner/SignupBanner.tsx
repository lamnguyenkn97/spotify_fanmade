'use client';

import React from 'react';
import { Stack, Typography, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';
import { SIGNUP_BANNER_CONFIG } from './SignupBanner.config';

interface SignupBannerProps {
  onSignUp?: () => void;
}

export const SignupBanner: React.FC<SignupBannerProps> = ({ onSignUp }) => {
  const { styles, content } = SIGNUP_BANNER_CONFIG;

  const containerClasses = `
        ${styles.position}
        ${styles.background}
        ${styles.spacing}
        ${styles.zIndex}
    `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className={containerClasses} style={{ width: '100%' }}>
      <Stack
        direction="row"
        align="center"
        justify="space-between"
        spacing="lg"
        style={{ width: '100%' }}
      >
        <Stack direction="row" align="center" spacing="sm" className="flex-1">
          <Typography
            variant="caption"
            weight="bold"
            size="sm"
            component="span"
            className="whitespace-nowrap"
            style={{ color: styles.textColor }}
          >
            {content.title}
          </Typography>
          <Typography
            variant="body"
            weight="light"
            size="sm"
            component="span"
            style={{ color: styles.textColor }}
          >
            {content.description}
          </Typography>
        </Stack>

        <Button
          text={content.button.text}
          variant={ButtonVariant.White}
          size={ButtonSize.Medium}
          onClick={onSignUp}
          aria-label={content.button.ariaLabel}
          className="flex-shrink-0"
          style={{ fontWeight: 700 }}
        />
      </Stack>
    </div>
  );
};
