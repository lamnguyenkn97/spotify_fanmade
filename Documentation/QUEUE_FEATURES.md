# Queue Features

Complete guide to the Queue functionality in the Spotify Fanmade app.

---

## 🎵 **Feature 1: Add Any Song to Queue**

### **How It Works:**

You can add **any song from any playlist** to the queue without playing it immediately.

### **Steps:**

1. **Navigate to any playlist** (Library, Search, Playlist page, etc.)
2. **Hover over a track** in the track table
3. **Click the ellipsis icon (⋯)** that appears on the right side
4. **Click "Add to queue"** from the context menu
5. ✅ The song is added to the end of the queue!

### **Visual Flow:**

```
Track Row (Hover)
  ├── Play/Pause Icon (left)
  ├── Track Info (middle)
  └── Ellipsis Icon ⋯ (right) ← Click here
      └── Context Menu
          └── "Add to queue" ← Click here
```

### **Code Implementation:**

```typescript
// TrackTable.tsx
const handleAddToQueue = (track: Track) => {
  const trackToAdd = convertTrackToCurrentTrack(track);
  addToQueue(trackToAdd);
  setContextMenuTrack(null);
};
```

### **Where It Works:**

- ✅ Playlist pages (`/playlist/[id]`)
- ✅ Artist pages (`/artist/[id]`)
- ✅ Search results (`/search`)
- ✅ Library (`/library`)
- ✅ Any page that uses `TrackTable` component

---

## 🗑️ **Feature 2: Remove Song from Queue**

### **How It Works:**

You can remove any upcoming song from the queue.

### **Steps:**

1. **Click the Queue icon** in the music player (bottom of screen)
2. **Queue drawer opens** on the right side
3. **Hover over any song** in the "Next from: Queue" section
4. **Click the X icon (✕)** that appears on the right side
5. ✅ The song is removed from the queue!

### **Visual Flow:**

```
Queue Drawer
  ├── Now Playing (current track)
  └── Next from: Queue
      ├── Track 1 (Hover) → X icon appears → Click to remove
      ├── Track 2 (Hover) → X icon appears → Click to remove
      └── Track 3 (Hover) → X icon appears → Click to remove
```

### **Code Implementation:**

```typescript
// QueueDrawer.tsx
const handleRemoveFromQueue = (queueIndex: number) => {
  removeFromQueue(queueIndex);
};

// In the UI
<Icon
  icon={faXmark}
  size="md"
  color="muted"
  clickable
  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    handleRemoveFromQueue(queueIndex);
  }}
  aria-label="Remove from queue"
/>
```

### **UI Behavior:**

- ✅ X icon is **hidden by default**
- ✅ X icon **appears on hover** (with smooth transition)
- ✅ Click is **prevented from bubbling** (doesn't play the track)
- ✅ **Immediate removal** from queue (no confirmation)

---

## 📊 **Queue Behavior**

### **Queue Order:**

1. **Currently Playing Track** - Shows in "Now playing" section
2. **Upcoming Tracks** - Shows in "Next from: Queue" section
3. **Auto-advance** - When current track ends, plays next track in queue

### **Queue Persistence:**

- ✅ Queue persists during the session
- ❌ Queue does NOT persist across page refreshes (in-memory only)

### **Add to Queue Rules:**

- ✅ Can add same song multiple times
- ✅ Can add song that's already in queue
- ✅ Added songs go to the **end** of the queue
- ✅ Can add songs from different playlists

### **Remove from Queue Rules:**

- ✅ Can remove any upcoming track
- ❌ Cannot remove currently playing track
- ✅ Removing updates queue index for remaining tracks
- ✅ If you remove all tracks, shows "No tracks in queue" message

---

## 🎨 **UI/UX Details**

### **Queue Drawer:**

| Component | Description |
|-----------|-------------|
| **Position** | Right side of screen |
| **Width** | 400px |
| **Backdrop** | Semi-transparent dark overlay |
| **Close Methods** | X button, Escape key, Click outside |
| **Scrolling** | Vertical scroll if many tracks |

### **Track Actions:**

| Action | Icon | Location | Visibility |
|--------|------|----------|------------|
| **Add to Queue** | ⋯ (Ellipsis) | Track table (right) | On hover |
| **Remove from Queue** | ✕ (X mark) | Queue drawer (right) | On hover |
| **Play Track** | ▶ (Play) | Track number column | On hover |

### **Visual Feedback:**

- ✅ **Hover states** - Track row highlights on hover
- ✅ **Icon transitions** - Smooth fade in/out (opacity animation)
- ✅ **Color changes** - Icons change color on hover
- ✅ **Cursor changes** - Pointer cursor on clickable elements

---

## 🔧 **Technical Implementation**

### **Context Provider:**

```typescript
// MusicPlayerContext.tsx
const {
  queue,              // Current queue array
  addToQueue,         // Function to add track to queue
  removeFromQueue,    // Function to remove track from queue
  currentTrack,       // Currently playing track
  playTrack,          // Function to play a track
} = useMusicPlayerContext();
```

### **Hook Methods:**

```typescript
// useMusicPlayer.ts

// Add track to end of queue
const addToQueue = useCallback((track: CurrentTrack) => {
  const newQueue = [...queue, track];
  setQueue(newQueue);
}, [queue, setQueue]);

// Remove track at specific index
const removeFromQueue = useCallback((index: number) => {
  const newQueue = queue.filter((_, i) => i !== index);
  setQueue(newQueue);
}, [queue, setQueue]);
```

### **Track Conversion:**

```typescript
// trackHelpers.ts
export const convertTrackToCurrentTrack = (track: Track): CurrentTrack => ({
  id: track.id,
  title: track.name,
  artist: track.artists.map(a => a.name).join(', '),
  album: track.album.name,
  coverUrl: track.album.images?.[0]?.url || '',
  duration: track.duration_ms,
  uri: `spotify:track:${track.id}`,
  previewUrl: track.preview_url || null,
});
```

---

## 🚀 **Usage Examples**

### **Example 1: Add Multiple Songs to Queue**

1. Go to your "Liked Songs" playlist
2. Hover over 3-4 different tracks
3. Click ellipsis → "Add to queue" for each
4. Open Queue drawer
5. See all 4 tracks lined up in "Next from: Queue"

### **Example 2: Create Custom Playback Order**

1. Currently playing: Song A
2. Add Song C to queue (from Playlist 1)
3. Add Song D to queue (from Playlist 2)
4. Add Song E to queue (from Search results)
5. Queue order: A (playing) → C → D → E

### **Example 3: Remove Unwanted Tracks**

1. Open Queue drawer
2. See 5 tracks in queue
3. Decide you don't want track #3
4. Hover over track #3
5. Click X icon
6. Track removed, remaining tracks: 4

---

## 📝 **Code Files**

### **Components:**

- `src/components/QueueDrawer/QueueDrawer.tsx` - Queue UI with remove functionality
- `src/components/TrackTable/TrackTable.tsx` - Track table with add to queue
- `src/components/MusicPlayer/MusicPlayer.tsx` - Music player with queue button

### **Hooks:**

- `src/hooks/useMusicPlayer.ts` - Queue management logic
- `src/contexts/MusicPlayerContext.tsx` - Queue state provider

### **Utils:**

- `src/utils/trackHelpers.ts` - Track conversion utilities

---

## 🎯 **Future Enhancements**

Potential improvements for the queue feature:

1. **Drag and Drop** - Reorder tracks in queue
2. **Queue Persistence** - Save queue to localStorage
3. **Clear Queue** - Button to remove all tracks
4. **Queue History** - See previously played tracks
5. **Smart Queue** - Suggest similar tracks to add
6. **Batch Actions** - Select multiple tracks to add/remove
7. **Queue from Context Menu** - Right-click to add to queue
8. **Keyboard Shortcuts** - Q to open queue, Delete to remove

---

## ✅ **Testing Checklist**

- [ ] Add song to queue from playlist
- [ ] Add song to queue from search
- [ ] Add multiple songs from different playlists
- [ ] Add same song twice to queue
- [ ] Remove song from middle of queue
- [ ] Remove last song from queue
- [ ] Remove all songs from queue
- [ ] Click on queue track to play it
- [ ] Verify queue advances after track ends
- [ ] Check queue drawer opens/closes properly
- [ ] Verify icons appear on hover
- [ ] Test on different screen sizes

---

**Last Updated**: November 29, 2025

