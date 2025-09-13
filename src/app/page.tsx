'use client'

import { ThemeProvider, AppHeader } from 'spotify-design-system'
import React from 'react';

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-spotify-dark text-white">
        <AppHeader 
          isAuthenticated={false}
          onSearch={() => console.log('Search clicked')}
          onLogin={() => console.log('Login clicked')}
          onSignUp={() => console.log('Sign up clicked')}
          onInstallApp={() => console.log('Install app clicked')}
        />
      </div>
    </ThemeProvider>
  )
} 