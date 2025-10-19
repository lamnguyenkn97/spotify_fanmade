export const SIDEBAR_CONFIG = {
  width: 'w-[280px]',
  colors: {
    background: 'bg-spotify-black',
    text: 'text-white',
    border: 'border-r border-spotify-grey3',
  },
  spacing: {
    header: 'p-6 pb-4',
    content: 'flex-1 px-6 overflow-y-auto',
    footer: 'p-6 pt-8',
  },
} as const;

export const CONTENT_CONFIG = {
  header: {
    title: 'Your Library',
    addButtonLabel: 'Add to library',
  },
  callToActions: [
    {
      id: 'create-playlist',
      title: 'Create your first playlist',
      description: "It's easy, we'll help you",
      buttonText: 'Create playlist',
      action: 'onCreatePlaylist' as const,
    },
    {
      id: 'browse-podcasts',
      title: "Let's find some podcasts to follow",
      description: "We'll keep you updated on new episodes",
      buttonText: 'Browse podcasts',
      action: 'onBrowsePodcasts' as const,
    },
  ],
  footer: {
    links: [
      { label: 'Legal', href: '#' },
      { label: 'Safety & Privacy Center', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'About Ads', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
    linkSize: 'text-[11px]', // Very small footer links (matching Spotify)
    cookiesNotice: 'Cookies',
    cookiesNoticeSize: 'xs', // Cookies notice size - smaller
    language: {
      label: 'English',
      ariaLabel: 'Select language',
    },
  },
} as const;
