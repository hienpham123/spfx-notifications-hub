# Compatibility Guide

## React Versions

This library is compatible with **React 16.8.0 and above** (up to React 19.x).

### Why React 16.8.0?

React 16.8.0 introduced **Hooks**, which this library uses:
- `useState`
- `useEffect`
- `useCallback`
- `useContext`
- `createContext`

### Supported React Versions

| React Version | Status | Notes |
|--------------|--------|-------|
| 16.8.0 - 16.x | ✅ Supported | Minimum required version |
| 17.x | ✅ Supported | Fully compatible |
| 18.x | ✅ Supported | Fully compatible |
| 19.x | ✅ Supported | Fully compatible |
| 20.x+ | ⚠️ Not tested | May work, but not officially supported yet |

### What React Features Are Used?

This library uses only **stable React APIs** that have been available since React 16.8:

- ✅ **Hooks** (React 16.8+)
  - `useState`, `useEffect`, `useCallback`, `useContext`
- ✅ **Context API** (React 16.3+)
  - `createContext`, `Context.Provider`, `useContext`
- ✅ **Component Types** (React 16+)
  - `React.FC`, `React.Component`, `ComponentType`
- ✅ **JSX** (React 16+)
  - Standard JSX syntax

### What React Features Are NOT Used?

This library **does NOT use** React 18+ specific features:

- ❌ `ReactDOM.createRoot()` - Only used in demo, not in library
- ❌ `useTransition` - Not used
- ❌ `useDeferredValue` - Not used
- ❌ `useId` - Not used
- ❌ `useSyncExternalStore` - Not used
- ❌ Automatic batching - Works with both old and new batching

## Node.js Versions

This library is compatible with **Node.js 12.0.0 and above**.

### Supported Node.js Versions

| Node Version | Status | Notes |
|--------------|--------|-------|
| 12.x | ✅ Supported | Minimum required |
| 14.x | ✅ Supported | LTS |
| 16.x | ✅ Supported | LTS |
| 18.x | ✅ Supported | LTS |
| 20.x+ | ✅ Supported | Current LTS |

## TypeScript

TypeScript is **optional** but recommended for type safety.

### TypeScript Versions

- **Minimum**: TypeScript 4.0+
- **Recommended**: TypeScript 5.0+

The library includes full TypeScript definitions in `dist/index.d.ts`.

## Fluent UI

This library uses **Fluent UI v8** (`@fluentui/react`).

### Fluent UI Version

- **Required**: `@fluentui/react@^8.118.0`
- **Icons**: `@fluentui/react-icons@^2.0.258` (optional, only for demo)

## Browser Compatibility

The library is compiled to **ES2015** (ES6) for maximum compatibility:

- ✅ Modern browsers (Chrome, Firefox, Edge, Safari)
- ✅ IE11+ (with polyfills if needed)
- ✅ Mobile browsers

## Installation in Different Projects

### Project with React 16.8

```bash
npm install spfx-notifications-hub react@^16.8.0 react-dom@^16.8.0
```

### Project with React 17

```bash
npm install spfx-notifications-hub react@^17.0.0 react-dom@^17.0.0
```

### Project with React 18

```bash
npm install spfx-notifications-hub react@^18.0.0 react-dom@^18.0.0
```

### Project with React 19

```bash
npm install spfx-notifications-hub react@^19.0.0 react-dom@^19.0.0
```

## Common Issues and Solutions

### Issue: Peer dependency warnings

**Solution**: Install the required React version:
```bash
npm install react@^16.8.0 react-dom@^16.8.0
```

### Issue: TypeScript errors with React types

**Solution**: Install matching `@types/react`:
```bash
npm install --save-dev @types/react@^16.8.0 @types/react-dom@^16.8.0
```

### Issue: Build errors in older Node versions

**Solution**: The library is pre-built, so you don't need to build it. Just install and use:
```bash
npm install spfx-notifications-hub
```

## Testing Compatibility

To test if the library works with your React version:

```tsx
import { NotificationsProvider, notify } from 'spfx-notifications-hub';

// If this works, you're good to go!
notify.success('Library is compatible!');
```

## Migration Notes

### From React 16 to React 18/19

No changes needed! The library works the same way across all supported React versions.

### From React 17 to React 18/19

No changes needed! The library is fully backward compatible.

## Summary

✅ **React**: 16.8.0 - 19.x  
✅ **Node.js**: 12.0+  
✅ **TypeScript**: 4.0+ (optional)  
✅ **Browser**: Modern browsers + IE11+ (with polyfills)  
✅ **Fluent UI**: v8  

The library is designed to work seamlessly across all these versions without any code changes!

