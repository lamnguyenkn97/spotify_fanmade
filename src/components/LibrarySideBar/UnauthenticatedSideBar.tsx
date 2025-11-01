'use client';

import React from 'react';
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Icon,
  Stack,
  TextLink,
  Typography,
} from 'spotify-design-system';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CallToActionCard } from './components';
import { noop } from 'lodash';
import { SIDEBAR_CONFIG, CONTENT_CONFIG } from './UnauthenticatedSideBar.config';

interface UnauthenticatedLibraryProps {
  onCreatePlaylist?: () => void;
  onBrowsePodcasts?: () => void;
  onAddClick?: () => void;
}

// Sub-components for better organization
const SidebarHeader: React.FC<{ onAddClick: () => void }> = ({ onAddClick }) => (
  <Stack
    direction="row"
    align="center"
    justify="space-between"
    className={SIDEBAR_CONFIG.spacing.header}
  >
    <Typography variant="heading" weight="bold" color="primary">
      {CONTENT_CONFIG.header.title}
    </Typography>
    <Button
      icon={<Icon icon={faPlus} size="sm" />}
      variant={ButtonVariant.Text}
      size={ButtonSize.Medium}
      onClick={onAddClick}
      aria-label={CONTENT_CONFIG.header.addButtonLabel}
    />
  </Stack>
);

const SidebarContent: React.FC<
  Pick<UnauthenticatedLibraryProps, 'onCreatePlaylist' | 'onBrowsePodcasts'>
> = ({ onCreatePlaylist, onBrowsePodcasts }) => {
  const actionHandlers = {
    onCreatePlaylist,
    onBrowsePodcasts,
  };

  return (
    <Stack direction="column" spacing="md" className={SIDEBAR_CONFIG.spacing.content}>
      {CONTENT_CONFIG.callToActions.map((cta) => (
        <CallToActionCard
          key={cta.id}
          title={cta.title}
          description={cta.description}
          buttonText={cta.buttonText}
          onButtonClick={actionHandlers[cta.action] || noop}
        />
      ))}
    </Stack>
  );
};

const FooterLinks: React.FC = () => (
  <div className="flex flex-wrap gap-x-4 gap-y-2">
    {CONTENT_CONFIG.footer.links.map((link) => (
      <TextLink key={link.label} href={link.href} className={`${CONTENT_CONFIG.footer.linkSize}`}>
        {link.label}
      </TextLink>
    ))}
  </div>
);

export const UnauthenticatedSideBar: React.FC<UnauthenticatedLibraryProps> = ({
  onCreatePlaylist = noop,
  onBrowsePodcasts = noop,
  onAddClick = noop,
}) => {
  const containerClasses = `
        ${SIDEBAR_CONFIG.width}
        h-screen
        ${SIDEBAR_CONFIG.colors.background}
        ${SIDEBAR_CONFIG.colors.text}
        ${SIDEBAR_CONFIG.colors.border}
    `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <Stack direction="column" className={containerClasses}>
      <SidebarHeader onAddClick={onAddClick} />
      <SidebarContent onCreatePlaylist={onCreatePlaylist} onBrowsePodcasts={onBrowsePodcasts} />
    </Stack>
  );
};
