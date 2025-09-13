# 🎵 Spotify Fanmade

A clean, minimal Spotify-inspired web app built with **Next.js** and **Tailwind CSS**. This project demonstrates modern web development practices with a focus on simplicity and performance.

---

## 🚀 Features

- 🎨 **Spotify-inspired Design** - Dark theme with green accents
- 📱 **Responsive Layout** - Works on all devices
- ⚡ **Fast Performance** - Built with Next.js and Tailwind
- 🎯 **TypeScript** - Type safety throughout
- 🎧 **Modern UI** - Clean, minimal interface

---

## 🛠️ Tech Stack

- [x] **Next.js 14** (App Router)
- [x] **React 18 + TypeScript**
- [x] **Tailwind CSS** (Styling)
- [x] **Inter Font** (Typography)

---

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/spotify_fanmade.git
cd spotify_fanmade
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3010](http://localhost:3010)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🎨 Design System

### **Spotify Color Palette:**
- **Primary Green**: `#1DB954`
- **Dark Background**: `#121212`
- **Surface**: `#282828`
- **Text**: `#FFFFFF`
- **Muted Text**: `#B3B3B3`

### **Tailwind Classes:**
```jsx
// Colors
className="bg-spotify-dark"     // Dark background
className="bg-spotify-green"    // Spotify green
className="bg-spotify-surface"  // Card surfaces
className="text-gray-300"       // Muted text

// Layout
className="min-h-screen"        // Full height
className="container mx-auto"   // Centered container
className="grid md:grid-cols-3" // Responsive grid
```

---

## 🧪 Available Scripts

- `npm run dev` - Start development server on port 3010
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

---

## 🔧 Development

### **Adding New Pages:**
Create files in `src/app/`:
- `src/app/about/page.tsx` → `/about`
- `src/app/contact/page.tsx` → `/contact`

### **Styling:**
Use Tailwind classes for rapid development:
```jsx
<div className="bg-spotify-surface rounded-lg p-6">
  <h2 className="text-xl font-semibold mb-4">Title</h2>
  <p className="text-gray-300">Content</p>
</div>
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Spotify** for design inspiration
- **Next.js team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **React community** for the ecosystem

---

**Made with ❤️ using Next.js and Tailwind CSS**