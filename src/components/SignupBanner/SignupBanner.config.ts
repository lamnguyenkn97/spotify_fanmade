export const SIGNUP_BANNER_CONFIG = {
  styles: {
    background: 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500',
    spacing: 'px-4 py-3',
    textColor: '#FFFFFF',
    position: 'fixed bottom-0 left-0 right-0',
    zIndex: 'z-50',
  },
  content: {
    title: 'Preview of Spotify',
    description:
      'Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.',
    button: {
      text: 'Sign up free',
      ariaLabel: 'Sign up for free Spotify account',
    },
  },
} as const;
