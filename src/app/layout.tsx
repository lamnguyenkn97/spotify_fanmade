import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import StyledComponentsRegistry from '@/lib/registry';
import '@/lib/fontawesome';

export const metadata: Metadata = {
  title: 'Spotify Fanmade',
  description: 'A fanmade Spotify web app built with React, Next.js, and custom design system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <div className="min-h-screen bg-spotify-dark text-white">{children}</div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
