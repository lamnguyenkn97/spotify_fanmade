'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface QueueDrawerContextType {
  isQueueOpen: boolean;
  openQueue: () => void;
  closeQueue: () => void;
  toggleQueue: () => void;
}

const QueueDrawerContext = createContext<QueueDrawerContextType | undefined>(undefined);

interface QueueDrawerProviderProps {
  children: ReactNode;
}

export const QueueDrawerProvider: React.FC<QueueDrawerProviderProps> = ({ children }) => {
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const openQueue = () => setIsQueueOpen(true);
  const closeQueue = () => setIsQueueOpen(false);
  const toggleQueue = () => setIsQueueOpen((prev) => !prev);

  return (
    <QueueDrawerContext.Provider value={{ isQueueOpen, openQueue, closeQueue, toggleQueue }}>
      {children}
    </QueueDrawerContext.Provider>
  );
};

export const useQueueDrawer = (): QueueDrawerContextType => {
  const context = useContext(QueueDrawerContext);
  if (!context) {
    throw new Error('useQueueDrawer must be used within QueueDrawerProvider');
  }
  return context;
};
