# Sidebar Component - Queue Integration

This document outlines how to update the `Sidebar` component in `spotify-design-system` to make it generic enough to support both library and queue use cases.

---

## 🎯 **Goal:**

Make `Sidebar` component reusable for:
1. ✅ Library sidebar (existing)
2. ✅ Queue sidebar (new)
3. ✅ Any future sidebar panel

---

## 📋 **Current Sidebar API**

### **Existing (Library-specific):**

```typescript
interface SidebarProps {
  libraryItems?: LibraryItem[];
  filters?: string[];
  onFilterClick?: (filter: string) => void;
  onAddClick?: () => void;
  onExpandClick?: () => void;
  onSearch?: (query: string) => void;
  onLibraryItemClick?: (item: LibraryItem) => void;
  showLogo?: boolean;
  className?: string;
}
```

**Issues:**
- ❌ Tied to `LibraryItem` type
- ❌ Only supports library-specific props
- ❌ Can't render custom content

---

## 🔧 **Proposed Generic Sidebar API**

### **New (Generic):**

```typescript
interface GenericSidebarProps extends React.HTMLAttributes<HTMLElement> {
  // Header
  title?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  headerActions?: React.ReactNode; // Custom header buttons
  
  // Content
  children: React.ReactNode; // Custom content
  
  // Styling
  width?: string; // e.g., '420px'
  position?: 'left' | 'right';
  className?: string;
  
  // Behavior
  isOpen?: boolean;
}
```

---

## 🎨 **Sidebar Structure**

```tsx
<aside className={`sidebar ${position}`} style={{ width }}>
  {/* Header */}
  <header className="sidebar-header">
    <Typography variant="heading" size="lg">
      {title}
    </Typography>
    
    {/* Custom header actions */}
    {headerActions}
    
    {/* Close button */}
    {showCloseButton && (
      <button onClick={onClose} aria-label="Close">
        <Icon icon={faTimes} />
      </button>
    )}
  </header>
  
  {/* Content - fully customizable */}
  <div className="sidebar-content">
    {children}
  </div>
</aside>
```

---

## 📦 **Usage Examples**

### **Example 1: Library Sidebar (Existing)**

```tsx
<Sidebar
  title="Your Library"
  width="280px"
  position="left"
>
  <LibraryFilters filters={filters} onFilterClick={onFilterClick} />
  <LibraryItems items={libraryItems} onItemClick={onLibraryItemClick} />
</Sidebar>
```

### **Example 2: Queue Sidebar (New)**

```tsx
<Sidebar
  title="Queue"
  width="420px"
  position="right"
  showCloseButton={true}
  onClose={closeQueue}
  isOpen={isQueueOpen}
>
  <QueueContent
    currentTrack={currentTrack}
    queue={queue}
    onTrackClick={playTrack}
    onRemove={removeFromQueue}
  />
</Sidebar>
```

### **Example 3: Custom Sidebar**

```tsx
<Sidebar
  title="Settings"
  width="360px"
  position="right"
  headerActions={
    <button>Reset</button>
  }
>
  <SettingsForm />
</Sidebar>
```

---

## 🎯 **Key Changes Needed**

### **1. Make Content Generic**

**Before:**
```typescript
// Fixed to library items
libraryItems?: LibraryItem[];
```

**After:**
```typescript
// Accept any content
children: React.ReactNode;
```

### **2. Add Header Customization**

```typescript
title?: string;
showCloseButton?: boolean;
onClose?: () => void;
headerActions?: React.ReactNode;
```

### **3. Support Both Sides**

```typescript
position?: 'left' | 'right'; // Default: 'left'
```

### **4. Make Width Configurable**

```typescript
width?: string; // Default: '280px' for library, '420px' for queue
```

### **5. Add Open/Close State**

```typescript
isOpen?: boolean; // Control visibility
```

---

## 🎨 **Styling Structure**

### **CSS/Styled Components:**

```css
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #121212;
  overflow: hidden;
}

.sidebar.left {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar.right {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  min-height: 64px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
```

---

## 📝 **Migration Path**

### **Phase 1: Add Generic Props (Backward Compatible)**

```typescript
interface SidebarProps {
  // Generic props (new)
  title?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
  width?: string;
  position?: 'left' | 'right';
  
  // Legacy props (keep for backward compatibility)
  libraryItems?: LibraryItem[];
  filters?: string[];
  // ... other legacy props
}
```

**Logic:**
```typescript
// If legacy props provided, render legacy library sidebar
if (libraryItems) {
  return <LegacyLibrarySidebar {...legacyProps} />;
}

// Otherwise, render generic sidebar
return (
  <GenericSidebar title={title} width={width} position={position}>
    {children}
  </GenericSidebar>
);
```

### **Phase 2: Deprecate Legacy Props**

Add console warnings:
```typescript
if (libraryItems) {
  console.warn('libraryItems prop is deprecated. Use children instead.');
}
```

### **Phase 3: Remove Legacy Props**

After all consumers migrate, remove legacy props.

---

## 🚀 **Implementation Checklist**

- [ ] Create `GenericSidebar` component
- [ ] Add `title`, `children`, `showCloseButton`, `onClose` props
- [ ] Add `width` and `position` props
- [ ] Add `isOpen` prop for visibility control
- [ ] Support `headerActions` for custom header buttons
- [ ] Add CSS classes for left/right positioning
- [ ] Keep legacy `Sidebar` for backward compatibility
- [ ] Export both `Sidebar` (legacy) and `GenericSidebar` (new)
- [ ] Update documentation
- [ ] Add Storybook examples

---

## 🎯 **Benefits**

1. ✅ **Reusable** - One component for all sidebars
2. ✅ **Flexible** - Accept any content via children
3. ✅ **Consistent** - Same styling and behavior
4. ✅ **Maintainable** - Single source of truth
5. ✅ **Backward Compatible** - Existing code still works
6. ✅ **Type Safe** - Full TypeScript support

---

## 📊 **Before vs After**

### **Before:**

```
- Sidebar (library-specific)
  - Fixed to LibraryItem type
  - Can't reuse for queue
  
- QueueDrawer (custom implementation)
  - Duplicate styling
  - Different behavior
  - Hard to maintain
```

### **After:**

```
- GenericSidebar (reusable)
  - Accept any content
  - Used for library
  - Used for queue
  - Used for anything
  
- Consistent UI/UX
- Single component to maintain
```

---

## 🔗 **Related Files**

### **Design System:**
- `spotify-design-system/src/components/organisms/Sidebar/`
  - `Sidebar.tsx` - Main component
  - `Sidebar.types.ts` - TypeScript types
  - `Sidebar.style.ts` - Styled components
  - `Sidebar.stories.tsx` - Storybook examples

### **Fanmade App:**
- `src/components/QueueDrawer/QueueDrawer.tsx` - Will use GenericSidebar
- `src/components/LibrarySideBar/` - Already uses Sidebar

---

## ✅ **Next Steps**

1. **Update Design System:**
   - Implement `GenericSidebar` component
   - Keep legacy `Sidebar` for backward compatibility
   - Add Storybook examples

2. **Update Fanmade App:**
   - Replace `QueueDrawer` with `GenericSidebar`
   - Pass queue content as children
   - Test both library and queue sidebars

3. **Documentation:**
   - Update design system docs
   - Add migration guide
   - Add best practices

---

**Last Updated**: November 29, 2025

