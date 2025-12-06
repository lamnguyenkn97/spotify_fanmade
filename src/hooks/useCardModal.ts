import { useState } from 'react';
import { SelectedCard } from '@/types';

/**
 * Custom hook to manage card click modal state
 * Handles opening/closing and storing selected card data
 */
export const useCardModal = () => {
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);

  const openCardModal = (title: string, imageUrl?: string) => {
    setSelectedCard({ title, imageUrl });
    setShowCardModal(true);
  };

  const closeCardModal = () => {
    setShowCardModal(false);
    setSelectedCard(null);
  };

  return {
    showCardModal,
    selectedCard,
    openCardModal,
    closeCardModal,
  };
};

