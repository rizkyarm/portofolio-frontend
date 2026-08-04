# Portfolio Frontend — Rizki Aditiya Ramadan

Personal portfolio website built with **React 19**, **Vite**, **Tailwind CSS**, and **Framer Motion**. Features a public-facing portfolio with project showcase, interactive image gallery, and a full admin dashboard.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 12 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| Icons | Lucide React + React Icons |
| SEO | React Helmet Async |
| Forms | React Hook Form |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── main.jsx                  # App entry point
├── App.jsx                   # Root component
├── index.css                 # Global styles & design tokens
├── assets/                   # Static assets (images, etc.)
├── components/
│   ├── Navbar.jsx            # Desktop top nav + mobile bottom nav
│   ├── Footer.jsx            # Site footer
│   ├── animations/           # Framer Motion animation components
│   │   ├── GradientMesh.jsx
│   │   ├── PageTransition.jsx
│   │   ├── Reveal.jsx
│   │   └── TextReveal.jsx
│   ├── layout/
│   │   └── ScrollProgress.jsx
│   ├── shared/
│   │   ├── ImageCarousel.jsx # Swipeable image gallery with drag & keyboard support
│   │   ├── Lightbox.jsx      # Fullscreen image viewer (React Portal)
│   │   ├── ProjectCard.jsx
│   │   ├── SectionHeader.jsx
│   │   └── SEO.jsx           # Meta tags, OG, Twitter Cards, JSON-LD
│   └── ui/
│       ├── Badge.jsx
│       └── Button.jsx
├── context/
│   ├── AuthContext.jsx       # Authentication state
│   └── DarkModeContext.jsx   # Dark/light mode state
├── hooks/
│   ├── useApiCache.js        # API cache with localStorage, debounce, error fallback
│   ├── useDarkMode.js
│   └── useReveal.js          # Intersection Observer hook
├── layouts/
│   ├── MainLayout.jsx        # Public pages wrapper
│   └── AdminLayout.jsx       # Admin dashboard wrapper
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx     # Image gallery + lightbox integration
│   ├── Services.jsx
│   ├── Contact.jsx
│   ├── NotFound.jsx          # 404 page
│   └── admin/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── ProjectsAdmin.jsx
│       ├── ProjectForm.jsx   # Image compression on upload
│       ├── SkillsAdmin.jsx
│       ├── ServicesAdmin.jsx
│       ├── MessagesAdmin.jsx
│       └── ProfileAdmin.jsx  # Avatar compression on upload
├── routes/
│   ├── AppRouter.jsx         # All route definitions
│   └── PrivateRoute.jsx      # Auth guard for admin routes
└── services/
    ├── api.js                # Axios instance with interceptors
    └── skillServices.js
```

## Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Home | Public |
| `/projects` | Projects | Public |
| `/projects/:slug` | Project Detail | Public |
| `/services` | Services | Public |
| `/about` | About | Public |
| `/contact` | Contact | Public |
| `*` | 404 Not Found | Public |
| `/admin/login` | Admin Login | Public |
| `/admin` | Dashboard | Authenticated |
| `/admin/projects` | Manage Projects | Authenticated |
| `/admin/projects/create` | Add Project | Authenticated |
| `/admin/projects/:id/edit` | Edit Project | Authenticated |
| `/admin/skills` | Manage Skills | Authenticated |
| `/admin/services` | Manage Services | Authenticated |
| `/admin/messages` | Messages | Authenticated |
| `/admin/profile` | Profile | Authenticated |

## Key Features

### 🖼️ Interactive Image Gallery
- **Swipeable carousel** with touch and mouse drag support (Pointer Events API)
- **Keyboard navigation** — arrow keys to navigate, Escape to close lightbox
- **Fullscreen lightbox** rendered via React Portal (escapes CSS `transform` containing-block issues)
- Unified drag/swipe across desktop and mobile

### 🚀 Performance & Caching
- **Cache-first API strategy** — returns cached data immediately, only fetches when cache is expired
- **Debounced requests** (400ms) — prevents burst requests on mount or HMR reload
- **Stale cache fallback** — when backend is unreachable, uses expired cache as fallback
- **Image compression** on upload — avatars and project images are resized and compressed to JPEG at 85% quality

### 🔍 SEO Optimization
- **Dynamic sitemap** generated at build time — includes all static pages and project detail URLs from the API
- **JSON-LD structured data** — Person, WebSite, WebPage, and CreativeWork schemas for rich search results
- **Open Graph & Twitter Cards** — configured for social sharing previews across all pages
- **OG image** — 1200×630px preview image for link sharing
- **Canonical URLs** — each page has a proper canonical link to avoid duplicate content
- **Semantic HTML** — `lang="id"` for Indonesian content, `meta robots` tag

### 🔐 Admin Dashboard
- Protected routes with auth guard
- Token-based authentication via Axios interceptors (auto-attach, 401 handling)
- Full CRUD for projects, skills, services, messages, and profile
- Form validation with friendly error messages

### 🎨 UI/UX
- **Dark/Light mode** — toggle with persistent preference
- **Responsive design** — mobile-first, bottom tab navigation on mobile, full top nav on desktop
- **Page transitions** — smooth Framer Motion animations between routes
- **Scroll reveal** — intersection observer-based animations
- **Custom 404 page** — themed not-found page with floating numbers

## Environment Variables

Create a `.env` file at the project root:

```env
VITE_API_URL=/api/v1
VITE_SITE_URL=https://yourdomain.vercel.app
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `/api/v1` |
| `VITE_SITE_URL` | Site URL for canonical & OG tags | `https://rizkiaditiyar.vercel.app` |

## Deployment

### Vercel

The project includes a `vercel.json` with:
- API proxy rewrites to the backend
- SPA fallback for client-side routing
- Static file serving for verification files

Environment variables must be set in **Vercel Project Settings → Environment Variables**.

### Build Process

```bash
npm run build
```

The build script:
1. Generates `public/sitemap.xml` with all static + dynamic project URLs
2. Runs Vite production build
3. Outputs everything to `dist/`
