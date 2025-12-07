'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Modal, ModalSize } from 'spotify-design-system';
import { loginWithSpotify } from '@/hooks/api';
import { RequestDemoModal, TrackDetailModal } from '@/components';
import { SpotifyTrack } from '@/types';

// ============================================================================
// Types
// ============================================================================

type ModalType = 'login' | 'featureNotImplemented' | 'cardInfo' | 'requestDemo' | 'trackDetail' | null;

interface ModalConfig {
  type: ModalType;
  title?: string;
  description?: string;
  cardTitle?: string;
  cardImageUrl?: string;
  track?: SpotifyTrack | null;
}

interface ModalContextValue {
  showLoginModal: () => void;
  showFeatureNotImplementedModal: () => void;
  showCardModal: (title: string, imageUrl?: string) => void;
  showRequestDemoModal: () => void;
  showTrackDetailModal: (track: SpotifyTrack) => void;
  closeModal: () => void;
}

// ============================================================================
// Context
// ============================================================================

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({ type: null });

  const showLoginModal = useCallback(() => {
    setModalConfig({
      type: 'login',
      title: 'Connect with Spotify',
      description: 'Log in with your Spotify account to experience all features including search, playlists, library, and personalized recommendations.',
    });
  }, []);

  const showFeatureNotImplementedModal = useCallback(() => {
    setModalConfig({
      type: 'featureNotImplemented',
      title: 'Feature Not Implemented',
      description: 'This feature is not implemented in this portfolio demo. Please visit the official Spotify website to experience the full functionality.',
    });
  }, []);

  const showCardModal = useCallback((title: string, imageUrl?: string) => {
    setModalConfig({
      type: 'cardInfo',
      cardTitle: title,
      cardImageUrl: imageUrl,
      title: 'Connect with Spotify',
      description: 'Log in with your Spotify account to experience all features including search, playlists, library, and personalized recommendations.',
    });
  }, []);

  const showRequestDemoModal = useCallback(() => {
    setModalConfig({
      type: 'requestDemo',
    });
  }, []);

  const showTrackDetailModal = useCallback((track: SpotifyTrack) => {
    setModalConfig({
      type: 'trackDetail',
      track,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig({ type: null });
  }, []);

  const handleLogin = () => {
    closeModal();
    loginWithSpotify();
  };

  const handleVisitSpotify = () => {
    window.open('https://open.spotify.com', '_blank');
    closeModal();
  };

  return (
    <ModalContext.Provider
      value={{
        showLoginModal,
        showFeatureNotImplementedModal,
        showCardModal,
        showRequestDemoModal,
        showTrackDetailModal,
        closeModal,
      }}
    >
      {children}

      {/* Login Modal */}
      {modalConfig.type === 'login' && (
        <Modal
          open={true}
          onClose={closeModal}
          size={ModalSize.Small}
          title={modalConfig.title || ''}
          description={modalConfig.description || ''}
          actions={[
            {
              label: 'Connect with Spotify',
              onClick: handleLogin,
              variant: 'primary',
            },
          ]}
          showCloseButton={true}
          closeOnBackdropClick={false}
          closeOnEscape={true}
        />
      )}

      {/* Feature Not Implemented Modal */}
      {modalConfig.type === 'featureNotImplemented' && (
        <Modal
          open={true}
          onClose={closeModal}
          size={ModalSize.Small}
          title={modalConfig.title || ''}
          description={modalConfig.description || ''}
          actions={[
            {
              label: 'Visit Spotify',
              onClick: handleVisitSpotify,
              variant: 'primary',
            },
          ]}
          showCloseButton={true}
          closeOnBackdropClick={true}
          closeOnEscape={true}
        />
      )}

      {/* Card Info Modal (for unauthenticated card clicks) */}
      {modalConfig.type === 'cardInfo' && (
        <Modal
          open={true}
          onClose={closeModal}
          size={ModalSize.Small}
          title={modalConfig.title || ''}
          description={modalConfig.description || ''}
          actions={[
            {
              label: 'Connect with Spotify',
              onClick: handleLogin,
              variant: 'primary',
            },
          ]}
          showCloseButton={true}
          closeOnBackdropClick={true}
          closeOnEscape={true}
        />
      )}

      {/* Request Demo Modal - Always mounted to preserve focus */}
      <RequestDemoModal 
        isOpen={modalConfig.type === 'requestDemo'} 
        onClose={closeModal} 
      />

      {/* Track Detail Modal */}
      <TrackDetailModal
        isOpen={modalConfig.type === 'trackDetail'}
        onClose={closeModal}
        track={modalConfig.track || null}
      />
    </ModalContext.Provider>
  );
};

// ============================================================================
// Hook
// ============================================================================

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

