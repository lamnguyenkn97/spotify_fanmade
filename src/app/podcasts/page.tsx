'use client';

import {
  Typography,
  Stack,
  Button,
  ButtonVariant,
  ButtonSize,
  Icon,
} from 'spotify-design-system';
import { CategoryCard } from 'spotify-design-system/dist/components/molecules/CategoryCard';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import categoriesData from '../data/categoriesData.json';
import { useSpotify } from '@/hooks/useSpotify';
import { getBestImageUrlByWidth } from '@/utils/imageHelpers';
import { useModal } from '@/contexts';


export default function PodcastsPage() {
  const { login } = useSpotify();
  const { showCardModal } = useModal();

  const sections = categoriesData.data.browse.sections.items.filter(
    (section) => section.data.title?.transformedLabel
  );

  return (
    <>
      {/* Content Sections */}
      <div className="px-6 pt-6 pb-24">
        {sections.map((section, sectionIndex) => {
          const firstItem = section.sectionItems.items.filter(
            (item) => item.content?.data?.data?.cardRepresentation
          )[0];
          const firstCard = firstItem?.content.data.data.cardRepresentation;
          const firstImageUrl = firstCard?.artwork?.sources
            ? getBestImageUrlByWidth(firstCard.artwork.sources)
            : undefined;

          return (
            <Stack key={sectionIndex} direction="column" spacing="lg" className="mb-8">
              <Typography variant="heading" size="xl" weight="bold" color="primary">
                {section?.data?.title?.transformedLabel}
              </Typography>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.sectionItems.items
                  .filter((item) => item.content?.data?.data?.cardRepresentation)
                  .map((item, itemIndex) => {
                    const card = item.content.data.data.cardRepresentation;
                    const imageUrl = card.artwork?.sources
                      ? getBestImageUrlByWidth(card.artwork.sources)
                      : undefined;

                    return (
                      <CategoryCard
                        key={itemIndex}
                        title={card.title.transformedLabel}
                        backgroundColor={card.backgroundColor.hex}
                        overlayImageUrl={imageUrl}
                        onClick={() => showCardModal(card.title.transformedLabel, imageUrl)}
                        aria-label={`Browse ${card.title.transformedLabel}`}
                      />
                    );
                  })}
              </div>

              {/* See all categories link */}
              {sectionIndex === sections.length - 1 && firstCard && (
                <Button
                  text="See all categories"
                  variant={ButtonVariant.Text}
                  size={ButtonSize.Medium}
                  onClick={() =>
                    showCardModal(firstCard.title.transformedLabel, firstImageUrl)
                  }
                  icon={<Icon icon={faChevronRight} size="sm" />}
                  style={{ fontWeight: 700 }}
                  className="self-start"
                />
              )}
            </Stack>
          );
        })}
      </div>
    </>
  );
}
