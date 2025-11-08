'use client';

import React from 'react';
import { Card, Typography, Stack, Button, ButtonVariant, ButtonSize } from 'spotify-design-system';

interface ContentSectionsProps {
  sections: any[];
  onCardClick: (title: string, imageUrl?: string) => void;
  onShowAll: (title: string, imageUrl?: string) => void;
  getCardProps: (item: any) => any;
}

export const ContentSections: React.FC<ContentSectionsProps> = ({
  sections,
  onCardClick,
  onShowAll,
  getCardProps,
}) => {
  return (
    <Stack direction="column" className="p-6">
      {sections.map((section, sectionIndex) => {
        const firstItem = section.sectionItems.items.filter((item: any) => item.content?.data)[0];
        const firstCardProps = firstItem ? getCardProps(firstItem) : null;

        return (
          <Stack key={sectionIndex} direction="column" spacing="sm" className="mb-8">
            {/* Section Header with Show all */}
            <Stack direction="row" align="center" justify="space-between" className="mb-2">
              <Typography variant="title" size="xl">
                {section.data.title.transformedLabel}
              </Typography>
              <Button
                text="Show all"
                variant={ButtonVariant.Text}
                size={ButtonSize.Small}
                onClick={() => {
                  if (firstCardProps) {
                    onShowAll(firstCardProps.title, firstCardProps.imageUrl);
                  }
                }}
              />
            </Stack>

            <div className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide">
              <div className="flex gap-4 min-w-max">
                {section.sectionItems.items
                  .filter((item: any) => item.content?.data)
                  .map((item: any, itemIndex: number) => {
                    const cardProps = getCardProps(item);
                    if (!cardProps) return null;

                    return (
                      <div key={itemIndex} className="flex-shrink-0" style={{ width: '180px' }}>
                        <Card
                          {...cardProps}
                          size="md"
                          showPlayButton
                          onPlayClick={() => console.log(`Playing ${cardProps.title}`)}
                          onClick={() => onCardClick(cardProps.title, cardProps.imageUrl)}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </Stack>
        );
      })}
    </Stack>
  );
};
