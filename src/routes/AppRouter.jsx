import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout    from '../layouts/MainLayout';
import AdminLayout   from '../layouts/AdminLayout';
import PrivateRoute  from './PrivateRoute';

import Home          from '../pages/Home';
import Projects      from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import Services      from '../pages/Services';
import About         from '../pages/About';
import Contact       from '../pages/Contact';

import Login          from '../pages/admin/Login';
import Dashboard      from '../pages/admin/Dashboard';
import ProjectsAdmin  from '../pages/admin/ProjectsAdmin';
import ProjectForm    from '../pages/admin/ProjectForm';
import SkillsAdmin    from '../pages/admin/SkillsAdmin';
import ServicesAdmin  from '../pages/admin/ServicesAdmin';
import MessagesAdmin  from '../pages/admin/MessagesAdmin';
import ProfileAdmin   from '../pages/admin/ProfileAdmin';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/"                element={<Home />} />
          <Route path="/projects"        element={<Projects />} />
          <Route path="/projects/:slug"  element={<ProjectDetail />} />
          <Route path="/services"        element={<Services />} />
          <Route path="/about"           element={<About />} />
          <Route path="/contact"         element={<Contact />} />
        </Route>

        {/* Auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin protected */}
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
    </BrowserRouter>
  );
}