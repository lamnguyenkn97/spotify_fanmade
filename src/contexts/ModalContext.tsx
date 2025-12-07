'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Modal, ModalSize, Stack, Typography, Image } from 'spotify-design-system';
import { loginWithSpotify } from '@/hooks/api';
import { RequestDemoModal, TrackDetailModal, GenreChart, TopArtistChart } from '@/components';
import { SpotifyTrack, SpotifyArtist } from '@/types';
import { getBestImageUrl } from '@/utils/imageHelpers';

// ============================================================================
// Types
// ============================================================================

type ModalType = 'login' | 'featureNotImplemented' | 'cardInfo' | 'requestDemo' | 'trackDetail' | 'topTracks' | 'topArtists' | 'genres' | null;

interface ModalConfig {
  type: ModalType;
  title?: string;
  description?: string;
  cardTitle?: string;
  cardImageUrl?: string;
  track?: SpotifyTrack | null;
  tracks?: SpotifyTrack[];
  artists?: SpotifyArtist[];
  genres?: Array<{ genre: string; count: number; percentage: number }>;
  onTrackClick?: (track: SpotifyTrack) => void;
  artistListeningTime?: Record<string, { minutes: number; trackCount: number }>;
}

interface ModalContextValue {
  showLoginModal: () => void;
  showFeatureNotImplementedModal: () => void;
  showCardModal: (title: string, imageUrl?: string) => void;
  showRequestDemoModal: () => void;
  showTrackDetailModal: (track: SpotifyTrack) => void;
  showTopTracksModal: (tracks: SpotifyTrack[], onTrackClick: (track: SpotifyTrack) => void) => void;
  showTopArtistsModal: (artists: SpotifyArtist[], artistListeningTime: Record<string, { minutes: number; trackCount: number }>) => void;
  showGenresModal: (genres: Array<{ genre: string; count: number; percentage: number }>) => void;
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

  const showTopTracksModal = useCallback((tracks: SpotifyTrack[], onTrackClick: (track: SpotifyTrack) => void) => {
    setModalConfig({
      type: 'topTracks',
      tracks,
      onTrackClick,
    });
  }, []);

  const showTopArtistsModal = useCallback((artists: SpotifyArtist[], artistListeningTime: Record<string, { minutes: number; trackCount: number }>) => {
    setModalConfig({
      type: 'topArtists',
      artists,
      artistListeningTime,
    });
  }, []);

  const showGenresModal = useCallback((genres: Array<{ genre: string; count: number; percentage: number }>) => {
    setModalConfig({
      type: 'genres',
      genres,
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
        showTopTracksModal,
        showTopArtistsModal,
        showGenresModal,
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

      {/* Top Tracks Modal */}
      {modalConfig.type === 'topTracks' && (
        <Modal
          open={true}
          onClose={closeModal}
          size={ModalSize.Large}
          title="Your Top Tracks"
          showCloseButton={true}
          closeOnBackdropClick={true}
          closeOnEscape={true}
        >
          <Stack direction="column" spacing="sm" className="p-6 max-h-[600px] overflow-y-auto">
            {modalConfig.tracks?.map((track, index) => (
              <Stack
                key={track.id}
                direction="row"
                spacing="md"
                align="center"
                className="p-4 bg-surface-elevated rounded-lg hover:bg-surface-elevated-hover transition-colors cursor-pointer group"
                onClick={() => modalConfig.onTrackClick?.(track)}
              >
                {/* Track Number */}
                <Typography variant="body" size="lg" weight="bold" color="secondary" className="w-8 text-center flex-shrink-0">
                  {index + 1}
                </Typography>
                
                {/* Album Art */}
                {track.album?.images && track.album.images.length > 0 && (
                  <Image
                    src={getBestImageUrl(track.album.images) || track.album.images[0].url}
                    alt={track.name}
                    variant="default"
                    className="w-16 h-16 flex-shrink-0 rounded"
                  />
                )}
                
                {/* Track Info */}
                <Stack direction="column" spacing="xs" className="flex-1 min-w-0">
                  <Typography variant="body" size="lg" weight="bold" color="primary" className="group-hover:text-spotify-green transition-colors">
                    {track.name}
                  </Typography>
                  <Typography variant="body" size="sm" color="secondary" className="truncate">
                    {track.artists.map(a => a.name).join(', ')}
                  </Typography>
                </Stack>
                
                {/* Popularity */}
                {track.popularity !== undefined && (
                  <Stack direction="row" spacing="xs" align="center" className="flex-shrink-0">
                    <Typography variant="body" size="sm" color="secondary">
                      Popularity:
                    </Typography>
                    <Typography variant="body" size="sm" weight="bold" color="primary">
                      {track.popularity}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            ))}
          </Stack>
        </Modal>
      )}

      {/* Top Artists Modal */}
      {modalConfig.type === 'topArtists' && modalConfig.artists && (
        <Modal
          open={true}
          onClose={closeModal}
          size={ModalSize.Large}
          title="Your Top Artists"
          showCloseButton={true}
          closeOnBackdropClick={true}
          closeOnEscape={true}
        >
          <Stack direction="column" spacing="lg" className="p-6">
            <TopArtistChart 
              artists={modalConfig.artists} 
              maxArtists={10}
              artistListeningTime={modalConfig.artistListeningTime || {}}
            />
          </Stack>
        </Modal>
      )}

      {/* Genres Modal */}
      {modalConfig.type === 'genres' && modalConfig.genres && (
        <Modal
          open={true}
          onClose={closeModal}
          size={ModalSize.Large}
          title="Genre Distribution"
          showCloseButton={true}
          closeOnBackdropClick={true}
          closeOnEscape={true}
        >
          <Stack direction="column" spacing="lg" className="p-6">
            <GenreChart genres={modalConfig.genres} maxItems={modalConfig.genres.length} />
          </Stack>
        </Modal>
      )}
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

