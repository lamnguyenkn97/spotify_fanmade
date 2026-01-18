'use client';

import React from 'react';
import {
  borderRadius,
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

const ProjectBadges: React.FC = () => {
  const badges = [
    { label: 'Portfolio Project' },
    { label: 'Fanmade' },
    { label: 'TypeScript' },
    { label: 'Custom Design System' },
  ];

  return (
    <Stack direction="row" spacing="xs" className="flex-wrap px-4 py-3 mx-4 mt-auto gap-2">
      {badges.map((badge, index) => (
        <span
          key={index}
          className="inline-block px-3 py-1 text-xs font-medium border border-spotify-green text-spotify-green bg-transparent rounded-full whitespace-nowrap"
        >
          {badge.label}
        </span>
      ))}
    </Stack>
  );
};

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

export const UnauthenticatedSideBar: React.FC<UnauthenticatedLibraryProps> = ({
  onCreatePlaylist = noop,
  onBrowsePodcasts = noop,
  onAddClick = noop,
}) => {
  const containerClasses = `
        ${SIDEBAR_CONFIG.width}
        flex-shrink-0
        h-full
        min-w-[280px]
        max-w-[280px]
        ${SIDEBAR_CONFIG.colors.background}
        ${SIDEBAR_CONFIG.colors.text}
        ${SIDEBAR_CONFIG.colors.border}
    `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <Stack direction="column" className={`${containerClasses} w-[280px] flex-shrink-0`}>
      <SidebarHeader onAddClick={onAddClick} />
      <SidebarContent onCreatePlaylist={onCreatePlaylist} onBrowsePodcasts={onBrowsePodcasts} />
      <ProjectBadges />
    </Stack>
  );
};
