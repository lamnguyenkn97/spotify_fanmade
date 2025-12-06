# Testing Checklist - Production Deployment

**Site:** https://spotify-fanmade.vercel.app/

---

## 🔐 Authentication Flow

### Unauthenticated State
- [ ] Homepage loads with portfolio badges (Portfolio Project, Fanmade, TypeScript, Custom Design System)
- [ ] "Log In" button visible in header
- [ ] Footer displays correctly with all links (Developer, Project, Social)
- [ ] Legal disclaimer present in footer
- [ ] Clicking search shows login prompt modal
- [ ] "Create playlist" shows login prompt
- [ ] "Browse podcasts" shows login prompt

### Login Flow
- [ ] Click "Log In" button
- [ ] Redirects to Spotify OAuth page
- [ ] Can log in with Spotify credentials
- [ ] Redirects back to homepage after successful login
- [ ] Shows authenticated homepage (not unauthenticated version)
- [ ] User name/profile appears in layout

### Logout
- [ ] Logout button visible when authenticated
- [ ] Clicking logout clears session
- [ ] Returns to unauthenticated homepage

---

## 🎵 Music Playback

### Player Controls
- [ ] Music player bar fixed at bottom
- [ ] Play/pause button works
- [ ] Skip forward button works
- [ ] Skip backward button works
- [ ] Volume slider adjusts volume
- [ ] Seek bar shows current position
- [ ] Seek bar is draggable
- [ ] Current time updates in real-time
- [ ] Track duration displays correctly

### Playback Modes
- [ ] Shuffle button toggles shuffle mode
- [ ] Repeat button cycles through: off → repeat all → repeat one
- [ ] Shuffle icon changes when active
- [ ] Repeat icon changes based on mode

### Track Information
- [ ] Album artwork displays in player
- [ ] Track title displays
- [ ] Artist name displays
- [ ] Artist name is clickable (goes to artist page)

---

## 📋 Queue Management

### Queue Drawer
- [ ] Queue button opens queue drawer
- [ ] Queue drawer slides in from right
- [ ] Close button closes queue drawer
- [ ] Currently playing track highlighted
- [ ] Queue list displays all upcoming tracks

### Queue Operations
- [ ] Can drag and drop tracks to reorder
- [ ] Reordering updates queue immediately
- [ ] Can remove tracks from queue (trash icon)
- [ ] Clicking track in queue plays it immediately
- [ ] Queue updates when track changes

---

## 📚 Library Features

### Sidebar Navigation
- [ ] Library sidebar displays on left
- [ ] "Your Library" header visible
- [ ] Filter buttons work (Playlists, Artists, Albums, Podcasts)
- [ ] Library items load and display
- [ ] Item count shows correctly
- [ ] Scroll works if many items

### Library Items
- [ ] Playlists show correct artwork
- [ ] Playlist names display
- [ ] Track counts show ("X songs")
- [ ] Clicking playlist navigates to playlist page
- [ ] Liked Songs appears (with heart icon)
- [ ] Albums show artist name
- [ ] Podcasts show episode count

### Library Page (/library)
- [ ] Shows all library items in grid/list
- [ ] Filter tabs work
- [ ] Items are clickable
- [ ] Loading skeleton displays while loading
- [ ] Error handling if API fails

---

## 🎧 Playlist Page

### Playlist Display
- [ ] Gradient background from album art
- [ ] Playlist cover art displays
- [ ] Playlist name shows
- [ ] Creator name shows
- [ ] Track count and duration show
- [ ] Description displays (if exists)

### Actions
- [ ] Large play button works (plays playlist)
- [ ] Shuffle button works
- [ ] More options button visible

### Track List
- [ ] All tracks display in table
- [ ] Track numbers show
- [ ] Track titles show
- [ ] Artist names show (clickable)
- [ ] Album names show (clickable)
- [ ] Duration shows
- [ ] Date added shows
- [ ] Explicit badge (E) shows for explicit tracks

### Track Interactions
- [ ] Clicking track plays it
- [ ] Hovering shows play icon
- [ ] Currently playing track highlighted (green)
- [ ] Double-click plays track
- [ ] Heart icon toggles like/unlike
- [ ] "Add to queue" works

---

## 🎤 Artist Page

### Artist Display
- [ ] Gradient background
- [ ] Artist image displays
- [ ] Artist name shows
- [ ] Follower count shows
- [ ] Verified badge (if applicable)

### Actions
- [ ] Play button plays artist's top tracks
- [ ] Shuffle button works
- [ ] Follow button visible (may show "Feature not implemented")

### Top Tracks
- [ ] Top tracks section displays
- [ ] Can play top tracks
- [ ] Track list formatted correctly

### Discography
- [ ] Album filter tabs work (Albums, Singles, Compilations, Appears On)
- [ ] Albums display in grid
- [ ] Album artwork shows
- [ ] Album names and years show
- [ ] Clicking album goes to album/playlist page

---

## 🔍 Search

### Search Interface
- [ ] Search bar in header works
- [ ] Can type search query
- [ ] Press Enter to search
- [ ] Loading state shows while searching

### Search Results
- [ ] Results categorized (Tracks, Artists, Albums, Playlists, Podcasts)
- [ ] Each category shows top results
- [ ] Track results display correctly
- [ ] Artist results show with circular images
- [ ] Album results show artwork
- [ ] Playlist results show
- [ ] Podcast results show

### Search Interactions
- [ ] Clicking track plays it
- [ ] Clicking artist goes to artist page
- [ ] Clicking album goes to playlist page
- [ ] Clicking playlist goes to playlist page
- [ ] Empty search handled gracefully

---

## 🎙️ Podcast/Show Page

### Show Display
- [ ] Show artwork displays
- [ ] Show name shows
- [ ] Publisher shows
- [ ] Description shows
- [ ] Episode count shows

### Actions
- [ ] Save button works (or shows "Feature not implemented")

### Episodes
- [ ] Episode list displays
- [ ] Episode titles show
- [ ] Episode descriptions show
- [ ] Episode duration shows
- [ ] Release date shows
- [ ] Can play episodes

---

## 🎨 UI/UX Features

### Loading States
- [ ] Skeleton screens show while loading
- [ ] Playlist header skeleton
- [ ] Track list skeleton
- [ ] No flash of empty content

### Toast Notifications
- [ ] Success toasts appear for actions (e.g., "Added to queue")
- [ ] Error toasts appear for failures (e.g., "Cannot play track")
- [ ] Toasts auto-dismiss after a few seconds
- [ ] Toasts are styled correctly

### Modals
- [ ] Login prompt modal works
- [ ] Feature not implemented modal shows when appropriate
- [ ] Modals have backdrop
- [ ] Clicking backdrop closes modal
- [ ] Close button (X) works
- [ ] ESC key closes modal

### Responsive Design
- [ ] Desktop view works (>1024px)
- [ ] Tablet view works (768px-1024px)
- [ ] Mobile view works (<768px)
- [ ] Player bar responsive
- [ ] Sidebar responsive (collapsible on mobile?)

### Animations
- [ ] Hover effects work on buttons/cards
- [ ] Transitions smooth (no jank)
- [ ] Drawer opens/closes smoothly
- [ ] No layout shift

---

## 🐛 Error Handling

### Network Errors
- [ ] Handles offline mode gracefully
- [ ] Shows error message if API fails
- [ ] Retry mechanism works (if implemented)

### Playback Errors
- [ ] Shows toast if track can't be played
- [ ] Handles no preview URL gracefully
- [ ] SDK initialization errors handled

### Navigation Errors
- [ ] 404 page exists
- [ ] Invalid IDs handled (e.g., /playlist/invalid-id)
- [ ] Error boundary catches React errors

---

## 🔒 Security

### Session Management
- [ ] Session persists on page refresh
- [ ] Session expires appropriately
- [ ] Token refresh works (if needed)
- [ ] Logout clears all session data

### Protected Routes
- [ ] Cannot access protected data when logged out
- [ ] Redirects to login when needed
- [ ] No token exposed in browser (HTTP-only cookies)

---

## ⚡ Performance

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Subsequent navigation fast
- [ ] Images lazy load
- [ ] No blocking resources

### Interactions
- [ ] Button clicks responsive
- [ ] No lag when playing tracks
- [ ] Smooth scrolling
- [ ] No memory leaks (check DevTools)

---

## 🌐 Cross-Browser Testing

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## 📱 Device Testing

- [ ] Desktop (Windows)
- [ ] Desktop (Mac)
- [ ] iPhone
- [ ] Android phone
- [ ] iPad
- [ ] Android tablet

---

## ♿ Accessibility

### Keyboard Navigation
- [ ] Can tab through interactive elements
- [ ] Focus indicators visible
- [ ] Can navigate with keyboard only
- [ ] ESC closes modals

### Screen Reader
- [ ] ARIA labels present
- [ ] Alt text on images
- [ ] Semantic HTML used

---

## 🎯 Critical Path (Must Work)

**Priority 1 - Core Flow:**
1. [ ] Load homepage
2. [ ] Click "Log In"
3. [ ] Authenticate with Spotify
4. [ ] See authenticated homepage
5. [ ] Click any playlist
6. [ ] Play a track
7. [ ] Verify playback works
8. [ ] Add track to queue
9. [ ] Open queue drawer
10. [ ] Search for something
11. [ ] Play search result

**If these 11 steps work, your app is production-ready!**

---

## 📝 Notes

**Test with 2 account types:**
- [ ] Spotify Premium account (full playback via SDK)
- [ ] Spotify Free account (30s preview fallback)

**Browser DevTools checks:**
- [ ] No console errors (red)
- [ ] No 404s in Network tab
- [ ] No memory leaks in Performance tab

**Lighthouse scores (optional):**
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 80

---

## ✅ Sign-off

**Tested by:** _______________

**Date:** _______________

**Device/Browser:** _______________

**Issues found:** _______________

---

**Critical issues = Must fix before sharing**

**Minor issues = Note but can ship**

