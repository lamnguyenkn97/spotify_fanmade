'use client';

import React from 'react';
import { Sidebar, SidebarVariant, SidebarPosition, QueueItem } from 'spotify-design-system';
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';
import { CurrentTrack } from '@/hooks/useMusicPlayer';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const QueueDrawer: React.FC<QueueDrawerProps> = ({ isOpen, onClose }) => {
  const { currentTrack, queue, playTrack, removeFromQueue, setQueue } = useMusicPlayerContext();

  // Convert CurrentTrack to QueueItem format
  const convertToQueueItem = (track: CurrentTrack): QueueItem => ({
    id: track.id,
    image: track.coverUrl,
    title: track.title,
    subtitle: track.artist,
    artist: track.artist,
    album: track.album,
    duration: formatDuration(track.duration),
  });

  // Find the current track index in the queue
  const currentIndex = currentTrack ? queue.findIndex((t) => t.id === currentTrack.id) : -1;

  // Separate current track and upcoming tracks
  const upcomingTracks = currentIndex >= 0 ? queue.slice(currentIndex + 1) : queue;

  // Convert to QueueItem format
  const nowPlayingItem: QueueItem | undefined = currentTrack ? convertToQueueItem(currentTrack) : undefined;
  const queueItems: QueueItem[] = upcomingTracks.map(convertToQueueItem);

  // Handle item click
  const handleItemClick = async (item: QueueItem, index: number) => {
    const track = upcomingTracks[index];
    if (track) {
      await playTrack(track);
    }
  };

  // Handle drag and drop reordering
  const handleItemReorder = (fromIndex: number, toIndex: number) => {
    if (currentIndex < 0) return;

    // Create new queue array
    const newQueue = [...queue];
    
    // Calculate actual indices in the full queue (accounting for current track)
    const actualFromIndex = currentIndex + 1 + fromIndex;
    const actualToIndex = currentIndex + 1 + toIndex;
    
    // Remove item from old position
    const [movedItem] = newQueue.splice(actualFromIndex, 1);
    
    // Insert item at new position
    newQueue.splice(actualToIndex, 0, movedItem);
    
    // Update queue
    setQueue(newQueue);
  };

  if (!isOpen) return null;

  return (
    <Sidebar
      variant={SidebarVariant.QUEUE}
      position={SidebarPosition.RIGHT}
      title="Queue"
      items={queueItems}
      nowPlaying={nowPlayingItem}
      showCloseButton={true}
      enableDragDrop={true}
      onClose={onClose}
      onItemClick={handleItemClick}
      onItemReorder={handleItemReorder}
    />
  );
};
