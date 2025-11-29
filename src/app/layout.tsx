import type { Metadata } from 'next';
import Script from 'next/script';
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
      <head>
        {/* Define onSpotifyWebPlaybackSDKReady before loading the script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onSpotifyWebPlaybackSDKReady = function() {
                // SDK is ready
              };
            `,
          }}
        />
        <Script src="https://sdk.scdn.co/spotify-player.js" strategy="beforeInteractive" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <AppLayout>{children}</AppLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
