import SpotifyWebApi from 'spotify-web-api-node';

// Scopes for Spotify API
export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify',
  'user-top-read',
  'user-read-recently-played',
].join(' ');

// Create Spotify API instance
export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Helper: Get authorization URL
export const getAuthorizationUrl = () => {
  return spotifyApi.createAuthorizeURL(SPOTIFY_SCOPES.split(' '), 'state');
};

// Helper: Exchange code for tokens
export const getTokens = async (code: string) => {
  const data = await spotifyApi.authorizationCodeGrant(code);
  return {
    accessToken: data.body.access_token,
    refreshToken: data.body.refresh_token,
    expiresIn: data.body.expires_in,
  };
};

// Helper: Refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  spotifyApi.setRefreshToken(refreshToken);
  const data = await spotifyApi.refreshAccessToken();
  return {
    accessToken: data.body.access_token,
    expiresIn: data.body.expires_in,
  };
};

// Helper: Create authenticated Spotify API instance
export const createSpotifyApi = (accessToken: string) => {
  const api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
  api.setAccessToken(accessToken);
  return api;
};

