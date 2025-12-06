# 🎵 Spotify Web Player - Full-Stack Clone

> **A production-grade Spotify web client featuring a custom-built design system published to NPM, real-time music playback, and OAuth authentication. Built with Next.js 14, TypeScript, and modern web technologies.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NPM Package](https://img.shields.io/badge/NPM_Published-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/spotify-design-system)

---

## ⚠️ Legal Disclaimer

> **IMPORTANT:** This is an **independent portfolio project** created for **educational and demonstration purposes only**.

**Trademark Notice:**
- This project is **NOT affiliated with, endorsed by, or connected to Spotify AB** or any of its subsidiaries or affiliates.
- "Spotify" is a **registered trademark** of Spotify AB (registration number EU008355043 and others).
- All Spotify trademarks, service marks, trade names, logos, and other intellectual property are the property of Spotify AB.

**Purpose & Usage:**
- This project is a **non-commercial, educational demonstration** of full-stack web development skills.
- Built as a **portfolio piece** to showcase technical abilities to potential employers and the development community.
- All music data is accessed exclusively through the **official Spotify Web API** in accordance with [Spotify's Developer Terms of Service](https://developer.spotify.com/terms).
- No music files are stored, hosted, or distributed by this application. All playback occurs through official Spotify infrastructure.

**No Copyright Infringement Intended:**
- This project does not reproduce, distribute, or claim ownership of any copyrighted material.
- The user interface design is inspired by Spotify's aesthetic for educational purposes, demonstrating proficiency in UI/UX development.
- Users must authenticate with their own Spotify accounts and have appropriate subscriptions for playback functionality.

**Open Source:**
- This code is provided under the MIT License for learning purposes.
- Anyone using this code is responsible for ensuring their own compliance with applicable laws and terms of service.

**If you are a representative of Spotify AB** and have concerns about this project, please contact me directly, and I will address them promptly.

---

## 🎯 Project Highlights

### 🎨 **Custom Design System** - Published to NPM
Built and published **[spotify-design-system](https://github.com/lamnguyenkn97/spotify_design_system)** - a comprehensive component library from scratch:

- 📦 **[Published to NPM](https://www.npmjs.com/package/spotify-design-system)** as `spotify-design-system` (v1.0.55)
- 🎨 **23 production-ready components** (Atoms, Molecules, Organisms)
- 📚 **[Live Storybook Documentation](https://spotify-storybook.vercel.app/?path=/story/atoms-messagetext--success)**
- ✅ **70+ test cases** with Jest + React Testing Library
- 🎯 **100% TypeScript** with comprehensive type definitions
- ♿ **WCAG AA compliant** with keyboard navigation support
- 🎨 **Complete design token system** (zero hardcoded values)
- 📦 **Tree-shakeable** for optimal bundle size

**Why this matters:** Demonstrates ability to architect, build, and publish reusable component libraries - a senior-level skill showcasing understanding of design systems, component APIs, and open-source development.

---

## 🚀 Live Demo & Documentation

| Resource | Link |
|----------|------|
| 🎵 **Live Application** | *[Deploy and add your URL here]* |
| 📦 **NPM Package** | [npmjs.com/package/spotify-design-system](https://www.npmjs.com/package/spotify-design-system) |
| 📚 **Storybook Docs** | [spotify-storybook.vercel.app](https://spotify-storybook.vercel.app/?path=/story/atoms-messagetext--success) |
| 🔧 **Design System Repo** | [github.com/lamnguyenkn97/spotify_design_system](https://github.com/lamnguyenkn97/spotify_design_system) |

---

## ✨ Key Features

### 🎧 **Advanced Music Playback**
- ✅ **Spotify Web Playback SDK** integration for premium users (full tracks)
- ✅ **Intelligent fallback system** to 30-second previews for free tier
- ✅ **Strategy Pattern implementation** for seamless playback switching
- ✅ **Podcast & episode playback** support
- ✅ **Full player controls** - play/pause, skip, volume, seek, shuffle, repeat

### 🎼 **Real-Time Queue Management**
- ✅ **Drag-and-drop reordering** with smooth animations (HTML5 Drag & Drop API)
- ✅ **One-click add/remove** tracks from queue
- ✅ **Now Playing indicator** with real-time updates
- ✅ **Persistent state** across navigation
- ✅ **Auto-open drawer** on "Add to Queue" for better UX

### 📚 **Complete Library Integration**
- ✅ **Personal library** - playlists, albums, artists, podcasts
- ✅ **Real-time sync** for liked/saved tracks with optimistic UI updates
- ✅ **Recently played** history with formatted timestamps
- ✅ **Top artists and albums** from Spotify API

### 🔍 **Universal Search**
- ✅ **Multi-entity search** across tracks, artists, albums, playlists, podcasts
- ✅ **Instant results** with optimized API calls
- ✅ **Clean categorized UI** with "See All" pagination

### 🎨 **Production-Quality UI/UX**
- ✅ **Custom design system** with 23 reusable components
- ✅ **Dynamic gradient backgrounds** extracted from album artwork
- ✅ **Fully responsive** (mobile, tablet, desktop)
- ✅ **Smooth animations** and micro-interactions
- ✅ **Dark theme** matching Spotify's aesthetic
- ✅ **WCAG AA accessibility** compliance

### 🔐 **Secure Authentication**
- ✅ **OAuth 2.0** with Spotify (PKCE flow)
- ✅ **Secure session management** with HTTP-only cookies
- ✅ **Automatic token refresh** handling
- ✅ **Graceful degradation** for unauthenticated users

---

## 🛠️ Technical Architecture

### **Tech Stack**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | SSR, API routes, static generation |
| **Language** | TypeScript 5.3 (Strict) | 100% type-safe codebase (7,500+ LOC) |
| **UI Library** | [spotify-design-system](https://github.com/lamnguyenkn97/spotify_design_system) | Custom component library (NPM published) |
| **Styling** | Tailwind CSS + Styled Components | Utility-first + CSS-in-JS |
| **State** | React Context + Custom Hooks | Global state without external dependencies |
| **API** | Spotify Web API + Web Playback SDK | Music data + premium playback |
| **Auth** | OAuth 2.0 | Secure token-based authentication |
| **Date Handling** | day.js | Lightweight date formatting (2KB) |
| **Color Extraction** | fast-average-color | Dynamic gradient backgrounds (3KB) |
| **Icons** | FontAwesome Pro | Comprehensive icon set |
| **Package Manager** | npm | Dependency management |
| **Code Quality** | ESLint + Prettier + TypeScript | Automated linting and formatting |

---

## 🏗️ Advanced Implementation Details

### **1. Strategy Pattern for Playback** 🎯

Implemented a sophisticated strategy pattern to handle different playback scenarios:

```typescript
// Adaptive playback strategy with automatic fallback
const strategy = usePlaybackStrategy(audioRef, webPlayback);

// Intelligent switching:
// 1. Try Spotify Web Playback SDK (Premium users, full tracks)
// 2. Automatic fallback to HTML5 audio with preview URLs
// 3. Graceful error handling at each level

await strategy.play(track); // Seamless for users
```

**Technical Achievement:** Demonstrates understanding of design patterns, error handling, and building resilient systems.

---

### **2. Custom Design System Architecture** 🎨

**Published to NPM:** `npm install spotify-design-system`

**Component Hierarchy:**
```
Atoms (15)      → Button, Icon, Typography, Input, Image, etc.
Molecules (5)   → Card, Drawer, Banner, SearchBar, etc.
Organisms (3)   → Sidebar, MusicPlayer, AppHeader
```

**Example Usage:**
```tsx
import { Stack, Card, Button, MusicPlayer } from 'spotify-design-system';

<Stack direction="column" spacing="lg">
  <Card 
    title="Liked Songs" 
    subtitle="150 songs"
    variant="playlist" 
    onClick={handlePlay}
  />
  <MusicPlayer track={currentTrack} onPlay={handlePlay} />
</Stack>
```

**Why it's impressive:**
- Atomic Design methodology
- Comprehensive TypeScript types
- Storybook documentation
- Automated testing
- NPM distribution pipeline
- Semantic versioning

**Resources:**
- 📦 [NPM Package](https://www.npmjs.com/package/spotify-design-system)
- 📚 [Storybook Documentation](https://spotify-storybook.vercel.app/?path=/story/atoms-messagetext--success)
- 💻 [GitHub Repository](https://github.com/lamnguyenkn97/spotify_design_system)

---

### **3. Real-Time State Synchronization** 🔄

**Challenge:** Keep UI in sync across components, Web Playback SDK, and API state.

**Solution:**
```typescript
// Optimistic UI updates with race condition handling
const [isLiked, setIsLiked] = useState(false);

const toggleLike = async (trackId: string) => {
  // Optimistic update
  setIsLiked(!isLiked);
  
  try {
    await fetch(`/api/spotify/save-track/${trackId}`, { method: 'POST' });
    // Sync complete
  } catch (error) {
    // Rollback on failure
    setIsLiked(isLiked);
  }
};
```

**Handles:**
- Like/unlike tracks (instant feedback)
- Shuffle state sync (SDK ↔ UI)
- Queue updates (drag-drop reordering)
- Playback position tracking

---

### **4. Custom Color Extraction** 🎨

Dynamically extracts dominant colors from album artwork for Spotify-style gradient backgrounds:

```typescript
import { FastAverageColor } from 'fast-average-color';

// Extract colors, create gradient
const colors = await extractColorsFromImage(albumArtUrl);
// → { color1: '#1ed760', color2: '#0a5c2e' }

// Applied as background gradient
background: linear-gradient(180deg, #1ed760 0%, #0a5c2e 100%);
```

**Visual Result:** Each playlist/album has a unique gradient that matches its artwork.

---

## 📁 Project Structure

```
spotify_fanmade/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/                     # API Routes
│   │   │   ├── auth/                # OAuth endpoints (login, callback, logout)
│   │   │   ├── spotify/             # Spotify API proxies (20+ endpoints)
│   │   │   └── playlists/           # Playlist CRUD operations
│   │   ├── artist/[id]/             # Dynamic artist pages
│   │   ├── playlist/[id]/           # Dynamic playlist pages
│   │   ├── show/[id]/               # Podcast show pages
│   │   ├── library/                 # User library page
│   │   ├── search/                  # Search functionality
│   │   └── page.tsx                 # Home page
│   │
│   ├── components/                  # React Components
│   │   ├── MusicPlayer/             # Fixed player with controls
│   │   ├── QueueDrawer/             # Drag-drop queue sidebar
│   │   ├── TrackTable/              # Sortable track lists
│   │   ├── PlaylistHeader/          # Playlist metadata & actions
│   │   ├── LibrarySideBar/          # Library navigation
│   │   └── AppLayout/               # Main application shell
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useMusicPlayer.ts        # Player state & controls
│   │   ├── useQueue.ts              # Queue management logic
│   │   ├── useRepeat.ts             # Repeat mode handling
│   │   ├── useSpotifyWebPlayback.ts # SDK integration
│   │   ├── usePlaybackStrategy.ts   # Strategy pattern implementation
│   │   └── useSpotify.ts            # API client wrapper
│   │
│   ├── contexts/                    # React Context Providers
│   │   ├── MusicPlayerContext.tsx   # Global player state
│   │   └── QueueDrawerContext.tsx   # Queue drawer visibility
│   │
│   ├── utils/                       # Utility Functions
│   │   ├── trackHelpers.ts          # Track data transformations
│   │   ├── colorExtractor.ts        # Album art color extraction
│   │   └── dateHelpers.ts           # Date formatting (day.js)
│   │
│   └── types/                       # TypeScript Definitions
│       └── index.ts                 # Shared types & interfaces
│
├── .env.example                     # Environment variables template
├── README.md                        # This file
├── package.json                     # Dependencies (20 packages)
└── tsconfig.json                    # TypeScript config (strict mode)
```

**Statistics:**
- 📊 **84 TypeScript/TSX files**
- 📝 **7,500+ lines of code**
- 🎯 **100% TypeScript coverage**
- ✅ **0 compilation errors**
- ✅ **0 ESLint errors**

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ installed
- Spotify account (Premium recommended for full playback)
- [Spotify Developer App](https://developer.spotify.com/dashboard)

### **Installation**

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/spotify_fanmade.git
cd spotify_fanmade
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up Spotify API**

Create a new app in [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
- Add redirect URI: `http://127.0.0.1:3010/api/auth/callback`
- Copy your **Client ID** and **Client Secret**

**4. Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3010/api/auth/callback
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3010
SESSION_SECRET=generate_random_secret_here
```

**5. Start the development server**
```bash
npm run dev
```

**6. Open your browser**
Navigate to [http://127.0.0.1:3010](http://127.0.0.1:3010)

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server (http://127.0.0.1:3010)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript validation
npm run format       # Format code with Prettier
```

---

## 🎯 Technical Achievements

### **1. Zero-Error Production Build** ✅
```bash
✅ TypeScript: 0 errors (strict mode)
✅ ESLint: 0 errors, 3 optional warnings
✅ Build: Successful (all pages < 200KB)
✅ Type Coverage: 100%
```

### **2. Performance Optimized** ⚡
```
Bundle Analysis:
├─ Home page:     8.93 kB (175 kB first load)
├─ Search:        2.25 kB (150 kB first load)
├─ Playlist:      7.61 kB (174 kB first load)
└─ Shared JS:     87.4 kB

✅ All pages under 200KB first load
✅ Automatic code splitting
✅ Static generation where possible
✅ Tree-shaking enabled
```

### **3. Modern Development Practices** 📚
- ✅ **Monorepo structure** with clear separation of concerns
- ✅ **Custom hooks** for business logic reusability
- ✅ **Context API** for global state (no Redux overhead)
- ✅ **Strategy Pattern** for flexible playback handling
- ✅ **Optimistic UI** updates for better UX
- ✅ **Error boundaries** and graceful fallbacks
- ✅ **Accessibility first** (keyboard navigation, ARIA labels)

### **4. Published NPM Package** 📦
Successfully built, tested, and published a production-ready component library:
- 🎯 Semantic versioning (v1.0.55)
- 📚 Comprehensive documentation
- ✅ Automated testing (70+ tests)
- 🔄 CI/CD pipeline
- 📦 NPM distribution

---

## 💡 What I Learned

### **Design Systems**
- Architecting reusable component libraries
- Publishing packages to NPM with proper versioning
- Creating comprehensive Storybook documentation
- Writing production-quality tests (Jest + RTL)
- Implementing atomic design methodology

### **State Management**
- React Context API for global state
- Custom hooks for encapsulating business logic
- Handling race conditions in async operations
- Implementing optimistic UI updates
- Managing complex state dependencies

### **API Integration**
- OAuth 2.0 authentication flows
- Working with third-party SDKs (Spotify Web Playback)
- Building RESTful API routes with Next.js
- Handling rate limits and errors gracefully
- Implementing automatic token refresh

### **Performance Optimization**
- Code splitting and lazy loading
- Bundle size optimization with tree-shaking
- Efficient re-rendering strategies
- Image optimization techniques
- Reducing first load JS size

### **Software Engineering**
- Design patterns (Strategy Pattern)
- TypeScript strict mode best practices
- Error handling and fallback strategies
- Accessibility compliance (WCAG AA)
- Production deployment workflows

---

## 🎨 Design Philosophy

This project demonstrates understanding of:
- **Component-driven development** (build small, compose big)
- **Design systems** (consistency, reusability, scalability)
- **User experience** (smooth interactions, instant feedback)
- **Performance** (bundle size, load times, optimization)
- **Accessibility** (keyboard navigation, screen readers, WCAG)
- **Type safety** (TypeScript strict mode, preventing runtime errors)
- **Code quality** (ESLint, Prettier, clean code principles)

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 84 TypeScript/TSX files |
| **Lines of Code** | 7,500+ |
| **Components** | 63 (40 custom + 23 design system) |
| **API Routes** | 20+ endpoints |
| **Custom Hooks** | 8 reusable hooks |
| **Bundle Size** | 87.4 KB shared (excellent!) |
| **First Load** | < 200 KB (all pages) |
| **TypeScript Coverage** | 100% |
| **Build Time** | ~45 seconds |
| **Dependencies** | 20 direct, 416 total |
| **Zero Vulnerabilities** | ✅ All packages secure |

---

## 🔗 Links & Resources

### **This Project**
- 🎵 **Live Demo**: *[Add your deployed URL]*
- 💼 **Portfolio**: *[Add your portfolio URL]*
- 💻 **GitHub**: *[This repository]*

### **Design System**
- 📦 **NPM Package**: [npmjs.com/package/spotify-design-system](https://www.npmjs.com/package/spotify-design-system)
- 📚 **Storybook**: [spotify-storybook.vercel.app](https://spotify-storybook.vercel.app/?path=/story/atoms-messagetext--success)
- 💻 **GitHub**: [github.com/lamnguyenkn97/spotify_design_system](https://github.com/lamnguyenkn97/spotify_design_system)

### **Connect**
- 💼 **LinkedIn**: *[Add your LinkedIn]*
- 🐙 **GitHub**: [github.com/lamnguyenkn97](https://github.com/lamnguyenkn97)

---

## 📝 License

This project is licensed under the **MIT License** - see below for details.

```
MIT License

Copyright (c) 2025 Lam Nguyen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Note:** This license applies to the code in this repository only. It does not grant any rights to use Spotify's trademarks, branding, or copyrighted materials. Users must comply with [Spotify's Developer Terms of Service](https://developer.spotify.com/terms) and [Brand Guidelines](https://developer.spotify.com/documentation/design) when using this code.

---

## 🙏 Acknowledgments

- **Spotify AB** for providing the official Web API and design inspiration that made this educational project possible
- **Next.js Team** at Vercel for the incredible React framework
- **Vercel** for the deployment platform and infrastructure
- **FontAwesome** for the comprehensive icon library
- **Open Source Community** for the tools and libraries that power this project

**Design Inspiration:**
This project's UI/UX design is inspired by Spotify's web player interface as an exercise in recreating a professional, production-quality application. All design elements were recreated from scratch as a learning experience and do not use any proprietary Spotify code or assets.

---

## 💼 For Recruiters & Hiring Managers

This project demonstrates:

### **Senior-Level Skills**
- ✅ **System Design**: Architected and published a reusable component library to NPM
- ✅ **Full-Stack Development**: Next.js, API routes, authentication, real-time features
- ✅ **TypeScript Mastery**: 100% type-safe codebase with strict mode (7,500+ LOC)
- ✅ **State Management**: Complex state handling without external libraries
- ✅ **Design Patterns**: Strategy Pattern, Context API, Custom Hooks
- ✅ **API Integration**: OAuth 2.0, REST APIs, SDK integration
- ✅ **Performance**: Bundle optimization, code splitting, efficient rendering
- ✅ **Testing**: 70+ test cases for published component library
- ✅ **DevOps**: NPM publishing, CI/CD, deployment workflows
- ✅ **Documentation**: Comprehensive README, Storybook docs, code comments

### **Why This Project Stands Out**
1. **Published NPM Package**: Not just built a project, but created and distributed a reusable library
2. **Production Quality**: Zero TypeScript errors, zero ESLint errors, comprehensive testing
3. **Advanced Patterns**: Strategy Pattern, optimistic UI, real-time sync, race condition handling
4. **Complete Feature Set**: Authentication, real-time playback, queue management, search, library
5. **Scalable Architecture**: Clean code, separation of concerns, reusable components
6. **Professional Polish**: Accessibility, responsive design, error handling, loading states

### **Tech Stack Highlights**
- ⚡ **Next.js 14** (App Router, SSR, API Routes)
- 🔷 **TypeScript 5.3** (Strict mode, 100% coverage)
- ⚛️ **React 18** (Hooks, Context, Suspense)
- 🎨 **Custom Design System** (Published to NPM)
- 🔐 **OAuth 2.0** (Spotify integration)
- 📦 **NPM Publishing** (Semantic versioning, distribution)

---

<div align="center">

**Built with ❤️ by Lam Nguyen** • [GitHub](https://github.com/lamnguyenkn97)

*Showcasing full-stack development expertise through production-grade code*

---

**© 2025 Lam Nguyen**

*Made with passion for music lovers*

**Not affiliated with Spotify AB • Independent Portfolio Project**

---

⭐ **Star this repo if you find it impressive!** ⭐

</div>
