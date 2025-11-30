'use client';

import React from 'react';
import { Modal, ModalSize } from 'spotify-design-system';

interface AuthModalsProps {
  // Unified Login Modal
  showCardModal: boolean;
  onCloseCardModal: () => void;
  onLogin: () => void;
}

/**
 * AuthModals Component
 * Unified login modal for all authentication prompts
 */
export const AuthModals: React.FC<AuthModalsProps> = ({
  showCardModal,
  onCloseCardModal,
  onLogin,
}) => {
  return (
    <Modal
      open={showCardModal}
      onClose={onCloseCardModal}
      size={ModalSize.Small}
      title="Connect with Spotify"
      description="Log in with your Spotify account to experience all features including search, playlists, library, and personalized recommendations."
      actions={[
        {
          label: 'Connect with Spotify',
          onClick: onLogin,
          variant: 'primary',
        },
      ]}
      showCloseButton={true}
      closeOnBackdropClick={true}
      closeOnEscape={true}
    />
  );
};

