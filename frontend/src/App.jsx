import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/admin/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

const HomePage = lazy(() => import('./pages/public/HomePage'));
const ArticlesPage = lazy(() => import('./pages/public/ArticlesPage'));
const ArticlePage = lazy(() => import('./pages/public/ArticlePage'));
const CategoryPage = lazy(() => import('./pages/public/CategoryPage'));
const SearchResultsPage = lazy(() => import('./pages/public/SearchResultsPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ArticlesAdminPage = lazy(() => import('./pages/admin/ArticlesAdminPage'));
const ArticleEditorPage = lazy(() => import('./pages/admin/ArticleEditorPage'));
const CategoriesAdminPage = lazy(() => import('./pages/admin/CategoriesAdminPage'));
const SettingsAdminPage = lazy(() => import('./pages/admin/SettingsAdminPage'));
const HomepageAdminPage = lazy(() => import('./pages/admin/HomepageAdminPage'));

function App() {
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  return (
    <Suspense fallback={<LoadingScreen fullScreen />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="articles" element={<ArticlesAdminPage />} />
          <Route path="articles/new" element={<ArticleEditorPage />} />
          <Route path="articles/:id/edit" element={<ArticleEditorPage />} />
          <Route path="categories" element={<CategoriesAdminPage />} />
          <Route path="homepage" element={<HomepageAdminPage />} />
          <Route path="settings" element={<SettingsAdminPage />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
