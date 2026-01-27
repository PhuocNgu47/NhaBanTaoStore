import { Outlet } from 'react-router-dom';
import { Header, Footer, FloatingContact } from '../components/common';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default MainLayout;
