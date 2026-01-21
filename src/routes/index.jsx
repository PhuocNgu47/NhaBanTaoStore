import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, AdminLayout, AuthLayout } from '../layouts';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages
import { lazy, Suspense } from 'react';
import { Loading } from '../components/common';

// Public Pages
const HomePage = lazy(() => import('../pages/HomePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const TrackOrderPage = lazy(() => import('../pages/TrackOrderPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage'));

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

// User Pages
const AccountPage = lazy(() => import('../pages/user/AccountPage'));
const OrdersPage = lazy(() => import('../pages/user/OrdersPage'));

// Admin Pages
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('../pages/admin/ProductsPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/UsersPage'));
const AdminCategoriesPage = lazy(() => import('../pages/admin/CategoriesPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/SettingsPage'));

// Wrapper for lazy loading
const LazyPage = ({ children }) => (
  <Suspense fallback={<Loading fullScreen />}>{children}</Suspense>
);

const router = createBrowserRouter([
  // Main Layout Routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <HomePage />
          </LazyPage>
        ),
      },
      {
        path: 'san-pham',
        element: (
          <LazyPage>
            <ProductsPage />
          </LazyPage>
        ),
      },
      {
        path: 'san-pham/:slug',
        element: (
          <LazyPage>
            <ProductDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'danh-muc/:categoryId',
        element: (
          <LazyPage>
            <CategoryPage />
          </LazyPage>
        ),
      },
      {
        path: 'gio-hang',
        element: (
          <LazyPage>
            <CartPage />
          </LazyPage>
        ),
      },
      {
        path: 'thanh-toan',
        element: (
          <LazyPage>
            <CheckoutPage />
          </LazyPage>
        ),
      },
      {
        path: 'tim-kiem',
        element: (
          <LazyPage>
            <SearchPage />
          </LazyPage>
        ),
      },
      {
        path: 'lien-he',
        element: (
          <LazyPage>
            <ContactPage />
          </LazyPage>
        ),
      },
      {
        path: 'tra-cuu-don-hang',
        element: (
          <LazyPage>
            <TrackOrderPage />
          </LazyPage>
        ),
      },
      {
        path: 'dat-hang-thanh-cong',
        element: (
          <LazyPage>
            <OrderSuccessPage />
          </LazyPage>
        ),
      },
      // Protected User Routes
      {
        path: 'tai-khoan',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <AccountPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'don-hang',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <OrdersPage />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
    ],
  },

      {
        path: 'dang-nhap',
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
      {
        path: 'dang-ky',
        element: (
          <LazyPage>
            <RegisterPage />
          </LazyPage>
        ),
      },
      {
        path: 'quen-mat-khau',
        element: (
          <LazyPage>
            <ForgotPasswordPage />
          </LazyPage>
        ),
      },

  // Admin Layout Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <DashboardPage />
          </LazyPage>
        ),
      },
      {
        path: 'san-pham',
        element: (
          <LazyPage>
            <AdminProductsPage />
          </LazyPage>
        ),
      },
      {
        path: 'danh-muc',
        element: (
          <LazyPage>
            <AdminCategoriesPage />
          </LazyPage>
        ),
      },
      {
        path: 'don-hang',
        element: (
          <LazyPage>
            <AdminOrdersPage />
          </LazyPage>
        ),
      },
      {
        path: 'nguoi-dung',
        element: (
          <LazyPage>
            <AdminUsersPage />
          </LazyPage>
        ),
      },
      {
        path: 'cai-dat',
        element: (
          <LazyPage>
            <AdminSettingsPage />
          </LazyPage>
        ),
      },
    ],
  },
]);

export default router;
