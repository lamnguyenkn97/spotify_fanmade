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
                            >
                              {imageUrl && <img src={imageUrl} alt={track.name} className="w-full h-full object-cover rounded" />}
                            </Card>
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
                            >
                              {imageUrl && <img src={imageUrl} alt={artist.profile?.name} className="w-full h-full object-cover rounded-full" />}
                            </Card>
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
                            >
                              {imageUrl && <img src={imageUrl} alt={album.name} className="w-full h-full object-cover rounded" />}
                            </Card>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </Stack>
                );
              })}
            </div>
          </Stack>
        </Stack>
      </div>
    </ThemeProvider>
  )
} 