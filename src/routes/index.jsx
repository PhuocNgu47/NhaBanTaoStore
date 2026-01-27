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
const UserOrderDetailPage = lazy(() => import('../pages/user/OrderDetailPage'));

// Admin Pages
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('../pages/admin/ProductsPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/UsersPage'));
const AdminCategoriesPage = lazy(() => import('../pages/admin/CategoriesPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
const AdminOrderDetailPage = lazy(() => import('../pages/admin/OrderDetailPage'));
const AdminCouponsPage = lazy(() => import('../pages/admin/CouponsPage'));
const AdminInventoryPage = lazy(() => import('../pages/admin/InventoryPage'));
const AdminCustomersPage = lazy(() => import('../pages/admin/CustomersPage'));
const AdminBannersPage = lazy(() => import('../pages/admin/BannersPage'));
const AdminLeadsPage = lazy(() => import('../pages/admin/LeadsPage'));
const AdminLeadDetailPage = lazy(() => import('../pages/admin/LeadDetailPage'));
const AdminActivityLogsPage = lazy(() => import('../pages/admin/ActivityLogsPage'));
const AdminStatisticsPage = lazy(() => import('../pages/admin/StatisticsPage'));
const AdminChatPage = lazy(() => import('../pages/admin/ChatPage'));

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
        path: 'danh-muc/:slug',
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
      {
        path: 'don-hang/:id',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <UserOrderDetailPage />
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
        path: 'thong-ke',
        element: (
          <LazyPage>
            <AdminStatisticsPage />
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
        path: 'don-hang/:id',
        element: (
          <LazyPage>
            <AdminOrderDetailPage />
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
      {
        path: 'ma-giam-gia',
        element: (
          <LazyPage>
            <AdminCouponsPage />
          </LazyPage>
        ),
      },
      {
        path: 'ton-kho',
        element: (
          <LazyPage>
            <AdminInventoryPage />
          </LazyPage>
        ),
      },
      {
        path: 'khach-hang',
        element: (
          <LazyPage>
            <AdminCustomersPage />
          </LazyPage>
        ),
      },
      {
        path: 'banner',
        element: (
          <LazyPage>
            <AdminBannersPage />
          </LazyPage>
        ),
      },
      {
        path: 'leads',
        element: (
          <LazyPage>
            <AdminLeadsPage />
          </LazyPage>
        ),
      },
      {
        path: 'leads/:id',
        element: (
          <LazyPage>
            <AdminLeadDetailPage />
          </LazyPage>
        ),
      },
      {
        path: 'logs',
        element: (
          <LazyPage>
            <AdminActivityLogsPage />
          </LazyPage>
        ),
      },
      {
        path: 'chat',
        element: (
          <LazyPage>
            <AdminChatPage />
          </LazyPage>
        ),
      },
    ],
  },
]);

export default router;
