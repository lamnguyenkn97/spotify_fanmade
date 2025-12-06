# API Client Layer Migration

## Overview

This project now uses a centralized API client layer with **SWR** for data fetching, replacing raw `fetch()` calls throughout the codebase. This provides:

✅ **Automatic caching** - No more duplicate API calls  
✅ **Automatic revalidation** - Data stays fresh  
✅ **Loading states** - Built-in `isLoading` for every request  
✅ **Error handling** - Consistent error handling across the app  
✅ **TypeScript support** - Full type safety  
✅ **Request deduplication** - Multiple components can request same data  
✅ **Focus revalidation** - Refresh data when user returns to tab  

---

## 📁 File Structure

```
src/
├── lib/
│   └── api-client.ts          # Base API client with HTTP methods
├── hooks/
│   └── api/
│       ├── index.ts            # Export all API hooks
│       ├── useAuth.ts          # Authentication hooks
│       └── useSpotifyApi.ts    # Spotify API hooks (30+ hooks)
```

---

## 🔧 Core API Client

### Base Client (`src/lib/api-client.ts`)

```typescript
import { apiClient } from '@/lib/api-client';

// GET request
const data = await apiClient.get('/api/spotify/my-playlists');

// POST request
const newPlaylist = await apiClient.post('/api/playlists', {
  name: 'My Playlist',
  description: 'My awesome playlist'
});

// With query parameters
const data = await apiClient.get('/api/spotify/search', {
  params: { q: 'Drake', limit: 20 }
});
```

### Features:
- ✅ Automatic JSON parsing
- ✅ Query parameter handling
- ✅ Error normalization
- ✅ TypeScript generics for type safety
- ✅ Consistent error format

---

## 🪝 SWR Hooks

### Authentication Hooks (`useAuth.ts`)

```typescript
import { useAuthUser, loginWithSpotify, logout } from '@/hooks/api';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuthUser();
  
  return (
    <div>
      {isLoading ? 'Loading...' : null}
      {isAuthenticated ? `Hello ${user.display_name}` : 'Not logged in'}
      <button onClick={loginWithSpotify}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Spotify API Hooks (`useSpotifyApi.ts`)

#### **Library Hooks**

```typescript
import {
  useSavedTracks,
  useMyPlaylists,
  useMyAlbums,
  useMyShows,
  useCheckSavedTracks,
} from '@/hooks/api';

// Get user's saved tracks (liked songs)
const { tracks, total, isLoading, mutate } = useSavedTracks(50);

// Get user's playlists
const { playlists, total, isLoading } = useMyPlaylists();

// Check if tracks are saved
const { savedStatus, isLoading } = useCheckSavedTracks(['track-id-1', 'track-id-2']);
```

#### **Personalization Hooks**

```typescript
import {
  useRecentlyPlayed,
  useTopArtists,
  useTopAlbums,
} from '@/hooks/api';

// Get recently played tracks
const { tracks, isLoading, hasPermissionError } = useRecentlyPlayed(50);

// Get top artists
const { artists, total, isLoading } = useTopArtists({
  time_range: 'short_term',
  limit: 20,
  offset: 0,
});

// Get top albums
const { albums, total, isLoading } = useTopAlbums({
  time_range: 'medium_term',
  limit: 20,
});
```

#### **Search Hook**

```typescript
import { useSearch } from '@/hooks/api';

function SearchPage() {
  const [query, setQuery] = useState('');
  
  // Only search when query is not empty
  const { results, isLoading, error } = useSearch(
    { q: query, limit: 20 },
    !!query // enabled flag
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {isLoading && 'Searching...'}
      {results && <Results data={results} />}
    </div>
  );
}
```

#### **Detail Page Hooks**

```typescript
import {
  usePlaylist,
  useArtist,
  useShow,
  useAlbumOrPlaylist,
} from '@/hooks/api';

// Get playlist details
const { playlist, tracks, isLoading, error } = usePlaylist('playlist-id');

// Get artist details
const { artist, isLoading, error } = useArtist('artist-id');

// Get show (podcast) details
const { show, episodes, isLoading, error } = useShow('show-id');

// Flexible: Try playlist first, fallback to album
const { data, isLoading, error } = useAlbumOrPlaylist('id-could-be-either');
```

#### **Browse Hooks (Unauthenticated)**

```typescript
import {
  useHomepageFeed,
  useFeaturedPlaylists,
  useNewReleases,
} from '@/hooks/api';

// Get homepage feed for unauthenticated users
const { feed, isLoading, error } = useHomepageFeed();

// Get featured playlists
const { playlists, isLoading, error } = useFeaturedPlaylists();

// Get new releases
const { albums, isLoading, error } = useNewReleases();
```

---

## 🔄 Migration Examples

### Before (Raw fetch)

```typescript
// ❌ Old way
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/spotify/my-playlists');
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setData(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### After (SWR)

```typescript
// ✅ New way
import { useMyPlaylists } from '@/hooks/api';

const { playlists, isLoading, error } = useMyPlaylists();

// That's it! SWR handles everything:
// - Fetching
// - Caching
// - Revalidation
// - Loading states
// - Error handling
```

---

## 🎯 Key Benefits

### 1. **Automatic Deduplication**
Multiple components requesting the same data will only trigger one API call.

```typescript
// Component A
const { playlists } = useMyPlaylists();

// Component B (reuses Component A's request)
const { playlists } = useMyPlaylists();
```

### 2. **Built-in Cache**
Data is cached automatically. No need for Redux, Context, or manual caching.

### 3. **Manual Revalidation**
```typescript
const { playlists, mutate } = useMyPlaylists();

// After creating a playlist, refresh the list
await createPlaylist('New Playlist');
mutate(); // Refetch playlists
```

### 4. **Conditional Fetching**
```typescript
// Only fetch if user is authenticated
const { playlists } = useMyPlaylists(isAuthenticated);

// Only search if query exists
const { results } = useSearch({ q: query }, !!query);
```

### 5. **Error Handling**
```typescript
const { data, error, isLoading } = useMyPlaylists();

if (isLoading) return <Skeleton />;
if (error) return <Error message={error.message} />;
return <Playlists data={data} />;
```

---

## 📝 Migration Status

### ✅ Completed
- [x] `AuthenticatedHomePage.tsx` - Uses `useRecentlyPlayed`, `useSavedTracks`, `useMyPlaylists`, `useTopArtists`, `useTopAlbums`, `useMyShows`
- [x] `AppLayout.tsx` - Uses `apiClient` for library items
- [x] `useSpotify.ts` - Refactored to use `useAuthUser` and `apiClient`

### 🚧 Remaining Files (Need Migration)
- [ ] `src/app/search/page.tsx` - Replace `fetch` with `useSearch`
- [ ] `src/app/artist/[id]/page.tsx` - Replace `fetch` with `useArtist`
- [ ] `src/app/show/[id]/page.tsx` - Replace `fetch` with `useShow`
- [ ] `src/app/playlist/[id]/page.tsx` - Replace `fetch` with `usePlaylist` or `useSavedTracks`
- [ ] `src/app/library/page.tsx` - Replace `fetch` with library hooks
- [ ] `src/hooks/useLikedTracks.ts` - Replace `fetch` with `useCheckSavedTracks`

---

## 🧪 Testing

After migration, test:

1. **Cache behavior** - Navigate between pages, data should persist
2. **Loading states** - Skeletons should appear briefly
3. **Error handling** - Disconnect network, errors should display
4. **Revalidation** - Switch tabs, data should refresh
5. **Deduplication** - Open DevTools Network tab, verify no duplicate requests

---

## 📚 Resources

- [SWR Documentation](https://swr.vercel.app/)
- [React Query vs SWR](https://swr.vercel.app/docs/comparison)
- [API Client Best Practices](https://kentcdodds.com/blog/application-state-management-with-react)

---

## 🎓 Best Practices

1. **Always use hooks in components** - Don't call `apiClient` directly in components (use it in event handlers only)
2. **Use conditional fetching** - Pass `enabled` flag to control when data fetches
3. **Leverage caching** - Trust SWR's cache, don't add your own `useState`
4. **Handle loading states** - Always render `<Skeleton>` when `isLoading === true`
5. **Error boundaries** - Wrap pages in `<ErrorBoundary>` for unhandled errors
6. **Mutate after mutations** - Call `mutate()` after creating/updating/deleting data

---

## 🚀 Next Steps

1. Finish migrating remaining 6 files (see "Remaining Files" above)
2. Add unit tests for API hooks
3. Add Storybook stories for loading/error states
4. Consider adding React Query DevTools for debugging
5. Add optimistic updates for better UX (e.g., instant UI updates before API response)

---

**Last Updated:** Dec 6, 2025  
**Status:** 🚧 In Progress (3/9 files migrated)

