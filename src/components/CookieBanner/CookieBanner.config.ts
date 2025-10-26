export const COOKIE_BANNER_CONFIG = {
  styles: {
    background: 'bg-[#EDEDED]',
    border: 'border-t border-gray-300',
    textColor: '#000000',
    spacing: 'px-4 py-3',
  },
  content: {
    text: {
      start: 'We and',
      middle:
        'use cookies to personalize your experience, to show you ads based on your interests, and for measurement and analytics purposes. By using our website and services, you agree to our use of cookies as described in our',
    },
    links: {
      partners: {
        text: 'our partners',
        href: '#',
      },
      cookiePolicy: {
        text: 'Cookie Policy.',
        href: '#',
      },
    },
  },
  closeButton: {
    ariaLabel: 'Close cookie banner',
  },
} as const;
