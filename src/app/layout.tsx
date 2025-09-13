import type { Metadata } from 'next'
import './globals.css'
import React from "react";

export const metadata: Metadata = {
  title: 'Spotify Fanmade',
  description: 'A fanmade Spotify web app built with React, Next.js, and custom design system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-spotify-dark text-white">
          {children}
        </div>
      </body>
    </html>
  )
} 