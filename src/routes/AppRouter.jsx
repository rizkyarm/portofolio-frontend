import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';

const Home          = lazy(() => import('../pages/Home'));
const Projects      = lazy(() => import('../pages/Projects'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const Services      = lazy(() => import('../pages/Services'));
const About         = lazy(() => import('../pages/About'));
const Contact       = lazy(() => import('../pages/Contact'));
const NotFound      = lazy(() => import('../pages/NotFound'));
const Login         = lazy(() => import('../pages/admin/Login'));

const AdminLayout   = lazy(() => import('../layouts/AdminLayout'));
const Dashboard     = lazy(() => import('../pages/admin/Dashboard'));
const ProjectsAdmin = lazy(() => import('../pages/admin/ProjectsAdmin'));
const ProjectForm   = lazy(() => import('../pages/admin/ProjectForm'));
const SkillsAdmin   = lazy(() => import('../pages/admin/SkillsAdmin'));
const ServicesAdmin = lazy(() => import('../pages/admin/ServicesAdmin'));
const MessagesAdmin = lazy(() => import('../pages/admin/MessagesAdmin'));
const ProfileAdmin  = lazy(() => import('../pages/admin/ProfileAdmin'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          <Route element={<MainLayout />}>
            <Route path="/"               element={<Home />} />
            <Route path="/projects"       element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/services"       element={<Services />} />
            <Route path="/about"          element={<About />} />
            <Route path="/contact"        element={<Contact />} />
            <Route path="*"               element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={
            <PrivateRoute><AdminLayout /></PrivateRoute>
          }>
            <Route index                    element={<Dashboard />} />
            <Route path="projects"          element={<ProjectsAdmin />} />
            <Route path="projects/create"   element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />
            <Route path="skills"            element={<SkillsAdmin />} />
            <Route path="services"          element={<ServicesAdmin />} />
            <Route path="messages"          element={<MessagesAdmin />} />
            <Route path="profile"           element={<ProfileAdmin />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}