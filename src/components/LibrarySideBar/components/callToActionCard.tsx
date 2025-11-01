import React from 'react';
import { Button, ButtonSize, ButtonVariant, Stack, Typography } from 'spotify-design-system';

export const CallToActionCard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}> = ({ title, description, buttonText, onButtonClick }) => {
  return (
    <Stack direction="column" spacing="md" className="bg-spotify-grey2 rounded-lg p-6">
      <Stack direction="column" spacing="sm">
        <Typography variant="heading" weight="bold" color="primary">
          {title}
        </Typography>
        <Typography variant="body" weight="light" size={'sm'} color="secondary">
          {description}
        </Typography>
      </Stack>
      <Button
        text={buttonText}
        variant={ButtonVariant.White}
        size={ButtonSize.Medium}
        onClick={onButtonClick}
        style={{ fontWeight: 700 }}
      />
    </Stack>
  );
};
