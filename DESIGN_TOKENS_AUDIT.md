# Design Tokens Audit

## ✅ Available Design Tokens from `spotify-design-system`

Your design system exports comprehensive design tokens that we should be using instead of hardcoded values.

### Import Statement:
```typescript
import { borderRadius, spacing, shadows, sizes } from 'spotify-design-system';
```

---

## 📦 Available Tokens

### 1. **Border Radius** (`borderRadius`)
```typescript
{
  xs: string;    // Extra small radius
  sm: string;    // Small radius
  md: string;    // Medium radius
  lg: string;    // Large radius
  xl: string;    // Extra large radius
  round: string; // Fully rounded (circle/pill)
}
```

### 2. **Spacing** (`spacing`)
```typescript
{
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  image: { sm, md, lg, xl };
  card: { playButton: { top, right } };
}
```

### 3. **Shadows** (`shadows`)
```typescript
{
  none, subtle, small, medium, large, xl,
  hover, focus, pressed,
  button: { default, hover, pressed },
  card: { default, hover },
  slider: { thumb, thumbHover }
}
```

### 4. **Sizes** (`sizes`)
```typescript
{
  height: { xs, sm, md, lg, xl, '2xl' },
  container: { banner, card, header, musicPlayer, footer },
  card: { 
    width: { sm: "160px", md: "200px", category: "200px" },
    height: { category: "120px" },
    image: { borderRadius }
  },
  icon: { xs, sm, md, lg, xl, '2xl' },
  avatar: { xs, sm, md, lg, xl },
  zIndex: { base, dropdown, sticky, modal, tooltip, popover, overlay, drawer },
  maxWidth: { tooltip, popover, modal, musicPlayer },
  musicPlayer: { ... }
}
```

---

## 🔍 Current Usage Analysis

### ❌ **Hardcoded Values We're Using:**

#### **Border Radius (18 occurrences)**
- `rounded` → Should use `borderRadius.md`
- `rounded-sm` → Should use `borderRadius.sm`
- `rounded-lg` → Should use `borderRadius.lg`
- `rounded-full` → Should use `borderRadius.round`

#### **Custom Widths (18 occurrences)**
- `w-[180px]` (cards) → **Could use** `sizes.card.width.md` (200px) **or keep as layout constraint**
- `w-[400px]` (tiles) → **No token available** - legitimate custom size
- `w-[280px]` (sidebar) → **No token available** - legitimate custom size
- `w-[450px]` (auth sidebar) → **No token available** - legitimate custom size

#### **Shadows (1 occurrence)**
- `shadow-[0_8px_32px_rgba(0,0,0,0.3)]` → Should use `shadows.large` or `shadows.xl`

#### **Padding/Spacing (55 occurrences)**
- Currently using: `p-2`, `p-6`, `p-8`, `px-3`, `py-2`, etc.
- These are **internal padding**, not spacing between elements
- **Decision needed**: Keep Tailwind utilities or use design tokens?

---

## 💡 Recommendations

### **Priority 1: Replace Border Radius** ✅
Replace all Tailwind radius classes with design tokens:
```tsx
// Before:
<div className="rounded-lg" />

// After:
<div style={{ borderRadius: borderRadius.lg }} />
```

### **Priority 2: Replace Shadows** ✅
Replace hardcoded shadow with design token:
```tsx
// Before:
className="shadow-[0_8px_32px_rgba(0,0,0,0.3)]"

// After:
style={{ boxShadow: shadows.xl }}
```

### **Priority 3: Card Widths** ⚠️
**Decision needed:**
- Current: `w-[180px]` for cards
- Token available: `sizes.card.width.md` = `"200px"`
- **Options:**
  1. Use `sizes.card.width.md` (changes card size)
  2. Keep `w-[180px]` as intentional layout constraint
  3. Add new token to design system: `sizes.card.width.sm = "180px"`

### **Priority 4: Padding** ⏸️
**Keep Tailwind utilities for now:**
- Spacing between elements → Already using `Stack spacing` prop ✅
- Internal padding → Tailwind `p-*` classes are appropriate
- Rationale: These are layout-specific, not design tokens

---

## 🎯 Action Items

### ✅ **Replace Immediately:**
1. Border radius classes → `borderRadius` tokens
2. Shadow values → `shadows` tokens

### ⏸️ **Needs Discussion:**
3. Card widths (`w-[180px]`) - standardize to `200px` or keep custom?
4. Sidebar widths (`w-[280px]`, `w-[450px]`) - add to design system or keep custom?

### ✅ **Keep As-Is:**
5. Padding utilities (`p-*`, `px-*`, `py-*`) - layout-specific
6. Layout utilities (`flex-1`, `min-w-0`, etc.) - not design tokens
7. Interactive utilities (`cursor-pointer`, `hover:*`) - not design tokens

---

## 📝 Implementation Example

```typescript
// Import design tokens
import { borderRadius, shadows, sizes } from 'spotify-design-system';

// Use in components
<Stack 
  className="cursor-pointer"
  style={{ 
    borderRadius: borderRadius.md,  // Instead of rounded
    boxShadow: shadows.card.hover,  // Instead of shadow-[...]
  }}
>
  <Card />
</Stack>
```

---

## 🚀 Benefits

1. **Consistency**: All border radii and shadows use exact same values
2. **Maintainability**: Change one token, update everywhere
3. **Type Safety**: TypeScript autocomplete for all tokens
4. **Documentation**: Self-documenting through token names
5. **Design System Compliance**: 100% adherence to design system

