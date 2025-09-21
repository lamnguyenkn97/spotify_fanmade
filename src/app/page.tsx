'use client'

import { ThemeProvider, AppHeader, Sidebar, Card, Typography } from 'spotify-design-system'
import React from 'react';

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
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Welcome Section */}
              <div className="mb-8">
                <Typography variant="heading" className="text-3xl font-bold mb-6">
                  Good afternoon
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {/* Playlist Cards */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card 
                      key={i} 
                      title={`Playlist ${i + 1}`} 
                      subtitle="By User"
                      variant="default"
                      size="md"
                      showPlayButton={true}
                      onPlayClick={() => console.log(`Playing Playlist ${i + 1}`)}
                      className="hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
              
              {/* Recently Played */}
              <div className="mb-8">
                <Typography variant="heading" className="text-2xl font-bold mb-6">
                  Recently played
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card 
                      key={i} 
                      title={`Recently Played ${i + 1}`} 
                      subtitle="Playlist"
                      variant="default"
                      size="md"
                      showPlayButton={true}
                      onPlayClick={() => console.log(`Playing Recently Played ${i + 1}`)}
                      className="hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
              
              {/* Made for You */}
              <div className="mb-8">
                <Typography variant="heading" className="text-2xl font-bold mb-6">
                  Made for you
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card 
                      key={i} 
                      title={`Made for You ${i + 1}`} 
                      subtitle="Made for you"
                      variant="default"
                      size="md"
                      showPlayButton={true}
                      onPlayClick={() => console.log(`Playing Made for You ${i + 1}`)}
                      className="hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Music Player */}
            <div className="h-20 bg-spotify-black border-t border-gray-800 flex items-center px-4">
              <div className="flex items-center space-x-4 w-1/4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div>
                  <Typography variant="body" className="text-white font-medium">
                    Song Title
                  </Typography>
                  <Typography variant="body" color="muted" className="text-sm">
                    Artist Name
                  </Typography>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-4">
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
                </div>
                <div className="flex items-center space-x-2 w-full max-w-md">
                  <Typography variant="caption" color="muted" className="text-xs">
                    0:00
                  </Typography>
                  <div className="flex-1 bg-gray-600 rounded-full h-1">
                    <div className="bg-white rounded-full h-1 w-1/3"></div>
                  </div>
                  <Typography variant="caption" color="muted" className="text-xs">
                    3:45
                  </Typography>
                </div>
              </div>
              
              <div className="w-1/4 flex items-center justify-end space-x-2">
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
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                  <div className="w-16 bg-gray-600 rounded-full h-1">
                    <div className="bg-white rounded-full h-1 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
} 