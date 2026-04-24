import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ExplorePage from './pages/ExplorePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import NarrowPage from './pages/NarrowPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProjects from './pages/admin/AdminProjects';
import AdminCategories from './pages/admin/AdminCategories';

const HIDE_FOOTER_ON = ['/login', '/register'];

export default function App() {
  const location = useLocation();

  const showFooter =
    !HIDE_FOOTER_ON.includes(location.pathname) &&
    !location.pathname.startsWith('/admin');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:id" element={<CategoryDetailPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/narrow" element={<NarrowPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}