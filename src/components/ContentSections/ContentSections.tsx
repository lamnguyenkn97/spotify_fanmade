'use client';

import React from 'react';
import { Card, Typography, Stack } from 'spotify-design-system';
import { ContentSectionsProps } from '@/types';

export const ContentSections: React.FC<ContentSectionsProps> = ({
  sections,
  onCardClick,
  getCardProps,
}) => {
  return (
    <Stack direction="column" className="p-6">
      {sections.map((section, sectionIndex) => {
        const firstItem = section.sectionItems.items.filter((item: any) => item.content?.data)[0];
        const firstCardProps = firstItem ? getCardProps(firstItem) : null;

        return (
          <Stack key={sectionIndex} direction="column" spacing="sm" className="mb-8">
            {/* Section Header */}
            <Stack direction="row" align="center" justify="space-between" className="mb-2">
              <Typography variant="title" size="xl">
                {section.data.title.transformedLabel}
              </Typography>
            </Stack>

            <div className="overflow-x-auto overflow-y-visible pb-4 -mx-6 px-6 scrollbar-hide">
              <Stack direction="row" spacing="md" className="min-w-max">
                {section.sectionItems.items
                  .filter((item: any) => item.content?.data)
                  .map((item: any, itemIndex: number) => {
                    const cardProps = getCardProps(item);
                    if (!cardProps) return null;

                    return (
                      <Stack key={itemIndex} className="flex-shrink-0 w-[180px]">
                        <Card
                          {...cardProps}
                          size="md"
                          showPlayButton
                          onPlayClick={() => {}}
                          onClick={() => onCardClick(cardProps.title, cardProps.imageUrl)}
                        />
                      </Stack>
                    );
                  })}
              </Stack>
            </div>
          </Stack>
        );
      })}
    </Stack>
  );
};
