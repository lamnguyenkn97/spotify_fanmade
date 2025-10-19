# 🔗 API Connection Flow: useSpotify ↔ Next.js API Routes

## How They Connect

The `useSpotify` hook (client-side) connects to Next.js API routes (server-side) through **HTTP requests** using the browser's `fetch()` API.

---

## 📊 Connection Mapping

### 1. Check Authentication Status (On Page Load)

**Client Side:**

```tsx
// src/hooks/useSpotify.ts
const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/me'); // ← HTTP GET request
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    }
  } catch (error) {
    console.error('Error checking auth:', error);
  }
};
```

**↓ HTTP Request travels over network ↓**

**Server Side:**

```tsx
// src/app/api/auth/me/route.ts
export async function GET(request: NextRequest) {
  // ← Handles the request
  const accessToken = request.cookies.get('spotify_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const spotifyApi = createSpotifyApi(accessToken);
  const userData = await spotifyApi.getMe();

  return NextResponse.json({
    // ← Response sent back
    id: userData.body.id,
    displayName: userData.body.display_name,
    email: userData.body.email,
    // ...
  });
}
```

---

### 2. Login Flow

**Client Side:**

```tsx
// src/hooks/useSpotify.ts
const login = async () => {
  const response = await fetch('/api/auth/login'); // ← HTTP GET
  const data = await response.json();
  if (data.url) {
    window.location.href = data.url; // Redirect to Spotify
  }
};
```

**↓ HTTP Request ↓**

**Server Side:**

```tsx
// src/app/api/auth/login/route.ts
export async function GET() {
  const authUrl = getAuthorizationUrl();
  return NextResponse.json({ url: authUrl }); // ← Response
}
```

---

### 3. Logout Flow

**Client Side:**

```tsx
// src/hooks/useSpotify.ts
const logout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' }); // ← HTTP POST
  setUser(null);
  window.location.href = '/';
};
```

**↓ HTTP Request ↓**

**Server Side:**

```tsx
// src/app/api/auth/logout/route.ts
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('spotify_access_token');
  response.cookies.delete('spotify_refresh_token');
  return response; // ← Response
}
```

---

### 4. Get Playlists

**Client Side:**

```tsx
// src/hooks/useSpotify.ts
const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await fetch('/api/playlists'); // ← HTTP GET
  const data = await response.json();
  return data.items;
};
```

**↓ HTTP Request ↓**

**Server Side:**

```tsx
// src/app/api/playlists/route.ts
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;
  const spotifyApi = createSpotifyApi(accessToken);
  const playlists = await spotifyApi.getUserPlaylists();

  return NextResponse.json({
    // ← Response
    items: playlists.body.items,
    total: playlists.body.total,
  });
}
```

---

### 5. Create Playlist

**Client Side:**

```tsx
// src/hooks/useSpotify.ts
const createPlaylist = async (name, description, isPublic) => {
  const response = await fetch('/api/playlists', {
    // ← HTTP POST
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, isPublic }),
  });
  return await response.json();
};
```

**↓ HTTP Request with JSON body ↓**

**Server Side:**

```tsx
// src/app/api/playlists/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json(); // ← Reads the JSON body
  const { name, description, isPublic } = body;

  const spotifyApi = createSpotifyApi(accessToken);
  const userData = await spotifyApi.getMe();
  const playlist = await spotifyApi.createPlaylist(userData.body.id, name, {
    description: description || '',
    public: isPublic !== false,
  });

  return NextResponse.json({
    // ← Response
    id: playlist.body.id,
    name: playlist.body.name,
    // ...
  });
}
```

---

## 🔑 Key Concepts

### 1. **URL Routing**

```
fetch('/api/auth/login')
       ^^^^^^^^^^^^^^^^
       This maps to: src/app/api/auth/login/route.ts
```

Next.js automatically maps URLs to file paths:

- `/api/auth/login` → `src/app/api/auth/login/route.ts`
- `/api/playlists` → `src/app/api/playlists/route.ts`
- `/api/playlists/abc123` → `src/app/api/playlists/[id]/route.ts`

### 2. **HTTP Methods**

```tsx
// Client
fetch('/api/playlists'); // GET
fetch('/api/playlists', { method: 'POST' }); // POST

// Server - exports match HTTP methods
export async function GET(request) {} // Handles GET
export async function POST(request) {} // Handles POST
```

### 3. **Request/Response Flow**

```
Client (Browser)                    Server (Next.js)
     │                                    │
     │──────fetch('/api/xxx')────────────►│
     │                                    │
     │                              Process request
     │                              Talk to Spotify
     │                                    │
     │◄─────NextResponse.json()───────────│
     │                                    │
   Parse JSON                             │
   Use data                               │
```

### 4. **Cookies (Authentication)**

```tsx
// Server sets cookies in response
response.cookies.set('spotify_access_token', token, { httpOnly: true });

// Browser automatically sends cookies with subsequent requests
fetch('/api/playlists'); // ← Cookies sent automatically

// Server reads cookies from request
const token = request.cookies.get('spotify_access_token')?.value;
```

---

## 🎯 Why This Architecture?

### **Separation of Concerns:**

- **Client (useSpotify)**: UI logic, state management, user interactions
- **Server (API routes)**: Authentication, Spotify API calls, sensitive operations

### **Security:**

- Client never sees Spotify Client Secret
- Tokens stored in HTTP-only cookies (can't be accessed by JavaScript)
- Server validates all requests

### **Benefits:**

1. ✅ Clean separation between frontend and backend
2. ✅ Secure token handling
3. ✅ Easy to test and maintain
4. ✅ Can be easily adapted to other backends (not just Next.js)

---

## 🔍 Debugging Connection

### Check if requests are being made:

```tsx
// Add console.log in useSpotify
const login = async () => {
  console.log('🔵 CLIENT: Calling /api/auth/login');
  const response = await fetch('/api/auth/login');
  console.log('🔵 CLIENT: Response:', response.status);
};
```

### Check if server receives requests:

```tsx
// Add console.log in route.ts
export async function GET() {
  console.log('🟢 SERVER: Received request to /api/auth/login');
  const authUrl = getAuthorizationUrl();
  console.log('🟢 SERVER: Sending auth URL:', authUrl);
  return NextResponse.json({ url: authUrl });
}
```

### Use Browser DevTools:

1. Open DevTools (F12)
2. Go to "Network" tab
3. Click "Log in"
4. See the request to `/api/auth/login`
5. See the response with `{ url: "https://accounts.spotify.com/..." }`

---

## 📌 Summary

**Connection Method:** HTTP Requests via `fetch()`

```
useSpotify Hook (Client)  ←──HTTP──→  Next.js API Routes (Server)
     ↑                                        ↑
  Browser                               Node.js Runtime
  React State                           Spotify API Client
  User Interaction                      Database/External APIs
```

The `fetch()` calls in `useSpotify` are the **bridge** that connects the client-side React code to the server-side Next.js API routes!
