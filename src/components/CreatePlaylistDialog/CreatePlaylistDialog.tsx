'use client';

import React, { useEffect } from 'react';
import { Stack, Typography, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';
import { CREATE_PLAYLIST_DIALOG_CONFIG } from './CreatePlaylistDialog.config';

interface CreatePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const CreatePlaylistDialog: React.FC<CreatePlaylistDialogProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const { styles, content } = CREATE_PLAYLIST_DIALOG_CONFIG;

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Dialog Container */}
      <div className={styles.container} onClick={onClose}>
        {/* Dialog */}
        <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
          <Stack direction="column" className={styles.content}>
            {/* Title */}
            <Typography variant="heading" size="xl" weight="bold" color="primary">
              {content.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body"
              size="md"
              color="secondary"
              className="mt-4"
              style={{ lineHeight: '1.5' }}
            >
              {content.description}
            </Typography>

            {/* Buttons */}
            <Stack
              direction="row"
              justify="flex-end"
              spacing="md"
              className={styles.buttonContainer}
            >
              <Button
                text={content.buttons.notNow}
                variant={ButtonVariant.Text}
                size={ButtonSize.Medium}
                onClick={onClose}
              />
              <Button
                text={content.buttons.logIn}
                variant={ButtonVariant.Primary}
                size={ButtonSize.Medium}
                onClick={onLogin}
                style={{ fontWeight: 700 }}
              />
            </Stack>
          </Stack>
        </div>
      </div>
    </>
  );
};
