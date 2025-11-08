/**
 * Enums and constants for the Spotify Fanmade application
 */

/**
 * Discography filter types for artist pages
 */
export enum DiscographyFilterType {
  POPULAR_RELEASES = 'Popular releases',
  ALBUMS = 'Albums',
  SINGLES_AND_EPS = 'Singles and EPs',
  COMPILATIONS = 'Compilations',
}

/**
 * Album types from Spotify API
 */
export enum AlbumType {
  ALBUM = 'album',
  SINGLE = 'single',
  EP = 'ep',
  COMPILATION = 'compilation',
}

/**
 * Time range options for Spotify API requests
 */
export enum TimeRange {
  SHORT_TERM = 'short_term', // Last 4 weeks
  MEDIUM_TERM = 'medium_term', // Last 6 months
  LONG_TERM = 'long_term', // Several years
}

/**
 * Display constants
 */
export const NUMBER_OF_DISPLAYED_ITEMS = 5;

