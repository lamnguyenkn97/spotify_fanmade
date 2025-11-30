'use client';

import { useState } from 'react';
import { Button, ButtonVariant, ButtonSize, Stack, Typography } from 'spotify-design-system';

export default function TestErrorPage() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error - ErrorBoundary is working!');
  }

  return (
    <Stack direction="column" align="center" justify="center" spacing="lg" className="min-h-screen">
      <Typography variant="heading" size="2xl" weight="bold" color="primary">
        Error Boundary Test Page
      </Typography>
      <Typography variant="body" color="secondary">
        Click the button below to trigger an error and see the ErrorBoundary in action.
      </Typography>
      <Button
        text="Trigger Error"
        variant={ButtonVariant.Primary}
        size={ButtonSize.Large}
        onClick={() => setShouldThrow(true)}
      />
    </Stack>
  );
}

