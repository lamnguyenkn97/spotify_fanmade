'use client'

import { ThemeProvider, AppHeader, Sidebar, Card, Typography, Stack } from 'spotify-design-system'
import React from 'react';
import homepageData from './data/homepageData.json';

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-spotify-dark text-white">
        {/* Header */}
        <AppHeader 
          isAuthenticated={false}
          onSearch={() => console.log('Search clicked')}
          onLogin={() => console.log('Login clicked')}
          onSignUp={() => console.log('Sign up clicked')}
          onInstallApp={() => console.log('Install app clicked')}
        />
        
        {/* Main Layout */}
        <Stack direction="row" className="h-screen">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <Stack direction="column" className="flex-1">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Dynamic Sections from Data */}
              {homepageData.data.home.sectionContainer.sections.items.map((section, sectionIndex) => {
                if (!section.data.title.transformedLabel) return null;
                return (
                  <Stack key={sectionIndex} direction="column" spacing="lg" className="mb-8">
                    <Typography variant="title" size={'xl'}>
                      {section.data.title.transformedLabel}
                    </Typography>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {section.sectionItems.items.slice(0, 6).map((item, itemIndex) => {
                        // Handle different content types
                        if (item.content.__typename === 'TrackResponseWrapper') {
                          const track = item.content.data as any;
                          const imageUrl = track.albumOfTrack?.coverArt?.sources?.[0]?.url;
                          return (
                            <Card 
                              key={itemIndex} 
                              title={track.name || 'Unknown Track'}
                              subtitle={track.artists?.items?.[0]?.profile?.name || 'Unknown Artist'}
                              variant="default"
                              size="md"
                              imageUrl={imageUrl}
                              showPlayButton={true}
                              onPlayClick={() => console.log(`Playing ${track.name}`)}
                            />
                          );
                        } else if (item.content.__typename === 'ArtistResponseWrapper') {
                          const artist = item.content.data as any;
                          const imageUrl = artist.visuals?.avatarImage?.sources?.[0]?.url;
                          return (
                            <Card 
                              key={itemIndex} 
                              title={artist.profile?.name || 'Unknown Artist'}
                              subtitle="Artist"
                              variant="artist"
                              size="md"
                              imageUrl={imageUrl}
                              showPlayButton={true}
                              onPlayClick={() => console.log(`Playing ${artist.profile?.name}`)}
                            />
                          );
                        } else if (item.content.__typename === 'AlbumResponseWrapper') {
                          const album = item.content.data as any;
                          const imageUrl = album.coverArt?.sources?.[0]?.url;
                          return (
                            <Card 
                              key={itemIndex} 
                              title={album.name || 'Unknown Album'}
                              subtitle={album.artists?.items?.[0]?.profile?.name || 'Unknown Artist'}
                              variant="default"
                              size="md"
                              imageUrl={imageUrl}
                              showPlayButton={true}
                              onPlayClick={() => console.log(`Playing ${album.name}`)}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </Stack>
                );
              })}
            </div>
            
            {/* Music Player */}
            <Stack direction="row" className="h-20 bg-spotify-black border-t border-gray-800 items-center px-4">
              <Stack direction="row" spacing="md" className="w-1/4 items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <Stack direction="column" spacing="xs">
                  <Typography variant="body" size="md" weight="medium">
                    Song Title
                  </Typography>
                  <Typography variant="body" size="sm" color="secondary">
                    Artist Name
                  </Typography>
                </Stack>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </Stack>
              
              <Stack direction="column" spacing="sm" className="flex-1 items-center">
                <Stack direction="row" spacing="md">
                  <button className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </button>
                  <button className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                  </button>
                </Stack>
                <Stack direction="row" spacing="sm" className="w-full max-w-md items-center">
                  <Typography variant="caption" size="sm" color="secondary">
                    0:00
                  </Typography>
                  <div className="flex-1 bg-gray-600 rounded-full h-1">
                    <div className="bg-white rounded-full h-1 w-1/3"></div>
                  </div>
                  <Typography variant="caption" size="sm" color="secondary">
                    3:45
                  </Typography>
                </Stack>
              </Stack>
              
              <Stack direction="row" spacing="sm" className="w-1/4 justify-end items-center">
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                </button>
                <Stack direction="row" spacing="xs" className="items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                  <div className="w-16 bg-gray-600 rounded-full h-1">
                    <div className="bg-white rounded-full h-1 w-1/2"></div>
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </ThemeProvider>
  )
} 