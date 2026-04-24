# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


portfolio-frontend/
├── 📦 KONFIGURASI & BUILD
│   ├── package.json              (Dependencies: React, Vite, TailwindCSS, Axios, Framer Motion)
│   ├── vite.config.js            (Bundler configuration)
│   ├── tailwind.config.js         (Tailwind CSS configuration)
│   ├── postcss.config.js          (PostCSS configuration)
│   ├── eslint.config.js           (Linting configuration)
│   └── index.html                 (Entry HTML)
│
├── 📂 SRC (Source Code)
│   ├── main.jsx                   (React entry point)
│   ├── App.jsx                    (Root component)
│   ├── index.css                  (Global styles)
│   │
│   ├── 🎨 COMPONENTS (Reusable UI Components)
│   │   ├── Navbar.jsx             (Navigation bar)
│   │   └── Footer.jsx             (Footer component)
│   │
│   ├── 📄 PAGES (Page Components)
│   │   ├── Home.jsx               (Homepage)
│   │   ├── About.jsx              (About page)
│   │   ├── Projects.jsx           (Projects listing page)
│   │   ├── ProjectDetail.jsx      (Individual project detail)
│   │   ├── Services.jsx           (Services page)
│   │   ├── Contact.jsx            (Contact/Messages page)
│   │   │
│   │   └── 🔐 ADMIN (Admin Dashboard Pages)
│   │       ├── Login.jsx          (Admin login page)
│   │       ├── Dashboard.jsx      (Admin dashboard home)
│   │       ├── ProfileAdmin.jsx   (Edit profile/personal info)
│   │       ├── ProjectsAdmin.jsx  (Manage projects - CRUD)
│   │       ├── ProjectForm.jsx    (Project form modal/component)
│   │       ├── SkillsAdmin.jsx    (Manage skills - CRUD) 
│   │       ├── ServicesAdmin.jsx  (Manage services - CRUD) 
│   │       └── MessagesAdmin.jsx  (View received messages)
│   │
│   ├── 🎯 ROUTES
│   │   ├── AppRouter.jsx          (Route configuration)
│   │   └── PrivateRoute.jsx       (Protected route wrapper)
│   │
│   ├── 🏗️ LAYOUTS (Layout Wrappers)
│   │   ├── MainLayout.jsx         (Public pages layout with Navbar/Footer)
│   │   └── AdminLayout.jsx        (Admin dashboard layout)
│   │
│   ├── 🎛️ CONTEXT (Global State Management)
│   │   ├── AuthContext.jsx        (Authentication state)
│   │   └── DarkModeContext.jsx    (Dark mode toggle state) 
│   │
│   ├── 🪝 HOOKS (Custom React Hooks)
│   │   └── useDarkMode.js         (Hook to access dark mode context)
│   │
│   ├── 🔌 SERVICES (API & External Services)
│   │   ├── api.js                 (Axios instance & API endpoints)
│   │   └── skillServices.js       (Skill-specific API calls)
│   │
│   └── 🎨 ASSETS (Static Assets)
│       ├── hero.png               (Hero image)
│       ├── react.svg              (React logo)
│       └── vite.svg               (Vite logo)
│
├── 📂 PUBLIC (Static files)
│
└── 📂 NODE_MODULES (Dependencies)
