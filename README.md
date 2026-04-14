# ToShort — URL Shortener

A frontend URL shortener built with React, Vite, Ant Design, and Tailwind CSS. Features a user-facing app and a separate admin dashboard, both with distinct color themes.

## Tech Stack

- **React 18** + **Vite**
- **Ant Design 5** — UI components
- **Tailwind CSS 3** — utility styling
- **React Router 7** — client-side routing
- **react-toastify** — toast notifications
- **dayjs** — date/time handling

## Features

### User App
- Shorten a long URL with an optional custom name
- Set expiry via quick presets (1 Hour, 24 Hours, 7 Days) or a custom date + time picker (past dates/times disabled)
- Copy shortened URL to clipboard
- Login / Register
- Profile page — paginated table of all shortened URLs with edit, delete, copy, and click stats

### Admin Dashboard
- Lookup any user by user ID or email
- View user details, role, status, and their full URL list
- Toggle URL active/inactive status
- Separate slate-orange color theme

### Other
- Fully configurable color theme — one file (`src/lib/theme.js`) controls all colors for both user and admin themes
- SPA routing handled via `public/_redirects` for Netlify
- Toast notifications with progress bar, auto-dismiss after 3 seconds, responsive positioning (top-right on desktop, top-center on mobile)

## Project Structure

```
src/
├── components/
│   ├── AdminThemeProvider.jsx   # Wraps admin pages with admin Ant Design theme
│   ├── AppHeader.jsx
│   ├── AppFooter.jsx
│   ├── PageLayout.jsx
│   ├── ProtectedRoute.jsx
│   ├── PublicOnlyRoute.jsx
│   └── AdminProtectedRoute.jsx
├── data/
│   ├── urls.json                # Mock URL + user data
│   └── adminUsers.json          # Mock admin user data
├── lib/
│   ├── theme.js                 # Single source of truth for all theme colors
│   └── toast.js                 # Reusable toast utility (showToast.success / .error)
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── MyProfile.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       └── AdminDashboard.jsx
├── App.jsx
├── main.jsx
└── index.css                    # CSS custom properties for both themes
```

## Theming

All colors are defined in `src/lib/theme.js`. Each theme has:
- `cssVars` — CSS custom properties applied via `:root` or `.admin-theme`
- `antd` — Ant Design `ConfigProvider` token overrides

To change a color, update it in `theme.js` — it propagates to all antd components and Tailwind classes (`bg-primary`, `text-accent`, etc.).

### Current palette

| Token | User | Admin |
|---|---|---|
| Primary | `#F97316` (orange) | `#EA580C` (deep orange) |
| Secondary | `#FFF7ED` (warm cream) | `#FEF3C7` (warm yellow) |
| Accent | `#FBBF24` (amber) | `#F59E0B` (amber) |
| Success | `#22C55E` | `#22C55E` |
| Warning | `#EAB308` | `#F59E0B` |
| Error | `#EF4444` | `#EF4444` |

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

### Build

```bash
npm run build
```

Outputs static files to `dist/`.

### Preview locally

```bash
npm run preview
```

### Deploy to Netlify (recommended)

1. Push to GitHub
2. Connect repo on [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`

The `public/_redirects` file is already configured for SPA routing.

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Self-host with nginx

```nginx
server {
    listen 80;
    root /var/www/toShort/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
