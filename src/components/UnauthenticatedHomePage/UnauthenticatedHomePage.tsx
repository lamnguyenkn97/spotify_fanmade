import React from 'react';
import { ContentSections } from '../ContentSections';

interface UnauthenticatedHomePageProps {
  sections: any[];
  onCardClick: (card: any) => void;
  onShowAll: (card: any) => void;
  getCardProps: (item: any) => any;
}

export const UnauthenticatedHomePage: React.FC<UnauthenticatedHomePageProps> = ({
  sections,
  onCardClick,
  onShowAll,
  getCardProps,
}) => {
  return (
    <ContentSections
      sections={sections}
      onCardClick={onCardClick}
      onShowAll={onShowAll}
      getCardProps={getCardProps}
    />
  );
};

