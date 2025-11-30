import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export const FOOTER_DATA = {
  developer: [
    { name: 'Portfolio', url: 'https://yourportfolio.com' }, // TODO: Update with your portfolio URL
    { name: 'GitHub Profile', url: 'https://github.com/lamnguyenkn97' },
  ],
  project: [
    { name: 'Project Repository', url: 'https://github.com/lamnguyenkn97/spotify_fanmade' },
    { name: 'Design System', url: 'https://github.com/lamnguyenkn97/spotify_design_system' },
    { name: 'Storybook', url: 'https://spotify-storybook.vercel.app' },
  ],
  social: [
    { icon: faGithub, url: 'https://github.com/lamnguyenkn97', label: 'GitHub' },
    { icon: faLinkedin, url: 'https://linkedin.com/in/yourprofile', label: 'LinkedIn' }, // TODO: Update with your LinkedIn URL
  ],
};

