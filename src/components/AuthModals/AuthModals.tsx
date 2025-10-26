'use client';

import React from 'react';
import { Modal, ModalSize } from 'spotify-design-system';

interface AuthModalsProps {
  // Create Playlist Modal
  showCreatePlaylistDialog: boolean;
  onCloseCreatePlaylist: () => void;
  onLogin: () => void;

  // Card Click Modal
  showCardModal: boolean;
  selectedCard: { title: string; imageUrl?: string } | null;
  onCloseCardModal: () => void;
  onSignUpFree: () => void;
}

/**
 * AuthModals Component
 * Manages all authentication-related modals in one place
 */
export const AuthModals: React.FC<AuthModalsProps> = ({
  showCreatePlaylistDialog,
  onCloseCreatePlaylist,
  onLogin,
  showCardModal,
  selectedCard,
  onCloseCardModal,
  onSignUpFree,
}) => {
  return (
    <>
      {/* Create Playlist Modal - Small */}
      <Modal
        open={showCreatePlaylistDialog}
        onClose={onCloseCreatePlaylist}
        size={ModalSize.Small}
        title="Create a playlist"
        description="Log in to create and share playlists."
        actions={[
          {
            label: 'Not now',
            onClick: onCloseCreatePlaylist,
            variant: 'text',
          },
          {
            label: 'Log in',
            onClick: onLogin,
            variant: 'primary',
          },
        ]}
        showCloseButton={false}
        closeOnBackdropClick={true}
        closeOnEscape={true}
      />

      {/* Card Click Modal - Medium with Image */}
      <Modal
        open={showCardModal}
        onClose={onCloseCardModal}
        size={ModalSize.Medium}
        title="Start listening with a free Spotify account"
        media={
          selectedCard?.imageUrl ? (
            <img
              alt={selectedCard.title}
              src={selectedCard.imageUrl}
              style={{ borderRadius: '8px', height: '280px', width: '280px', objectFit: 'cover' }}
            />
          ) : undefined
        }
        actions={[
          {
            label: 'Sign up free',
            onClick: onSignUpFree,
            variant: 'primary',
          },
        ]}
        footer={
          <>
            Already have an account?{' '}
            <button
              onClick={onLogin}
              className="text-white underline hover:no-underline cursor-pointer bg-transparent border-none font-inherit"
            >
              Log in
            </button>
          </>
        }
        showCloseButton={true}
        closeOnBackdropClick={true}
        closeOnEscape={true}
      />
    </>
  );
};

