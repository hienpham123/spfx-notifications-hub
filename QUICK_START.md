# Quick Start Guide

## Install Dependencies

```bash
cd spfx-notifications-hub
npm install
```

## Run Demo App

```bash
npm run dev
```

Open browser at `http://localhost:3000` to view the Todo app demo.

## Build Library

```bash
npm run build
```

Output will be in the `dist/` directory:
- `dist/cjs/index.js` - CommonJS format
- `dist/esm/index.js` - ES Module format
- `dist/index.d.ts` - TypeScript definitions
- `dist/index.css` - Styles

## Use in Other Projects

### 1. Copy Library

After building, you can:
- Copy the `dist/` folder to another project
- Or publish to npm private registry
- Or use local link: `npm link`

### 2. Import and Use

```tsx
// Wrap app with provider
import { NotificationsProvider } from 'spfx-notifications-hub';
import 'spfx-notifications-hub/styles'; // Import CSS

<NotificationsProvider>
  <YourApp />
</NotificationsProvider>

// Use global API
import { notify, confirm } from 'spfx-notifications-hub';

notify.success('Success!');
const result = await confirm({ message: 'Confirm?' });
```

## Project Structure

```
spfx-notifications-hub/
├── src/
│   ├── notifications/          # Library code
│   │   ├── components/          # Toast, Dialog, Confirm components
│   │   ├── context.tsx          # React Context & Provider
│   │   ├── hooks.ts             # useNotify, useConfirm, useDialog
│   │   ├── types.ts             # TypeScript types
│   │   ├── utils/               # Utilities (logging)
│   │   └── index.ts             # Library exports
│   ├── demo/                    # Demo Todo app
│   │   ├── TodoApp.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.ts                 # Main entry point
├── dist/                        # Build output (after build)
├── package.json
├── rollup.config.js             # Build config
└── README.md
```

## Key Features

✅ Promise-based `confirm()`  
✅ `notify.success()`, `notify.warning()`, `notify.error()`, `notify.info()`  
✅ Global provider, no prop drilling  
✅ Auto dismiss  
✅ Optional server logging  
✅ Fluent UI styling  

## Next Steps

1. Test the library with the demo app
2. Build library: `npm run build`
3. Copy `dist/` to other projects or publish to npm
4. Import and use in SPFx webparts or React apps
