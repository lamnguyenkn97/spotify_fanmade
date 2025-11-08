import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import '@/lib/fontawesome';
import { AppLayout } from '@/components';

export const metadata: Metadata = {
  title: 'Spotify Fanmade',
  description: 'A fanmade Spotify web app built with React, Next.js, and custom design system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <AppLayout>{children}</AppLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
