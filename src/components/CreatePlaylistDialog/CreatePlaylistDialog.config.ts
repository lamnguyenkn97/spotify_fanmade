export const CREATE_PLAYLIST_DIALOG_CONFIG = {
  styles: {
    overlay: 'fixed inset-0 bg-black bg-opacity-75 z-50',
    container: 'fixed inset-0 flex items-center justify-center z-50 p-4',
    dialog: 'bg-[#2A2A2A] rounded-lg shadow-xl max-w-md w-full',
    content: 'p-8',
    buttonContainer: 'mt-8',
  },
  content: {
    title: 'Create a playlist',
    description: 'Log in to create and share playlists.',
    buttons: {
      notNow: 'Not now',
      logIn: 'Log in',
    },
  },
} as const;
