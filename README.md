# Portfolio Frontend — Rizki Aditiya Ramadan

Personal portfolio website built with **React 19**, **Vite**, **Tailwind CSS**, and **Framer Motion**. Features a public-facing portfolio with project showcase and a full admin dashboard.

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
│   │   ├── ProjectCard.jsx
│   │   ├── SectionHeader.jsx
│   │   └── SEO.jsx
│   └── ui/
│       ├── Badge.jsx
│       └── Button.jsx
├── context/
│   ├── AuthContext.jsx       # Authentication state
│   └── DarkModeContext.jsx   # Dark/light mode state
├── hooks/
│   ├── useDarkMode.js
│   └── useReveal.js          # Intersection Observer hook
├── layouts/
│   ├── MainLayout.jsx        # Public pages wrapper
│   └── AdminLayout.jsx       # Admin dashboard wrapper
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx
│   ├── Services.jsx
│   ├── Contact.jsx
│   ├── NotFound.jsx          # 404 page
│   └── admin/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── ProjectsAdmin.jsx
│       ├── ProjectForm.jsx
│       ├── SkillsAdmin.jsx
│       ├── ServicesAdmin.jsx
│       ├── MessagesAdmin.jsx
│       └── ProfileAdmin.jsx
├── routes/
│   ├── AppRouter.jsx         # All route definitions
│   └── PrivateRoute.jsx      # Auth guard for admin routes
└── services/
    ├── api.js                # Axios instance with interceptors
    └── skillServices.js
```

## Environment Variables

Create a `.env` file at the project root:

```env
VITE_API_URL=http://localhost:3000/api/v1
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

## Features

- **Dark/Light Mode** — Toggle with persistent preference
- **Responsive Design** — Mobile-first with bottom tab navigation on mobile, full top nav on desktop
- **Page Transitions** — Smooth animations between routes
- **SEO Optimized** — Meta tags, Open Graph, Twitter Cards via React Helmet
- **Admin Dashboard** — Full CRUD for projects, skills, services, and messages
- **JWT Authentication** — Token-based auth with auto-refresh and 401 handling
- **404 Page** — Custom not-found page with themed design
| *(Layout Wrappers)* | `AdminLayout.jsx` | Admin dashboard layout |
| **🎛️ CONTEXT** | `AuthContext.jsx` | Authentication state |
| *(State Management)* | `DarkModeContext.jsx`| Dark mode toggle state |
| **🪝 HOOKS** | `useDarkMode.js` | Hook to access dark mode context |
| **🔌 SERVICES** | `api.js` | Axios instance & API endpoints |
| *(API Config)* | `skillServices.js` | Skill-specific API calls |
| **🎨 ASSETS** | `hero.png` | Hero image |
| *(Static Files)* | `react.svg` | React logo |
| | `vite.svg` | Vite logo |
| **📂 PUBLIC** | `-` | Static files for direct public access |
| **📂 NODE_MODULES**| `-` | Project dependencies |
