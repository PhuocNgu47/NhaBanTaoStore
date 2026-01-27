import { Outlet } from 'react-router-dom';
import { Header, Footer, FloatingContact } from '../components/common';
import SmartNotifications from '../components/common/SmartNotifications';
import SmartChatWidget from '../components/common/SmartChatWidget';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
      <SmartNotifications />
      <SmartChatWidget />
    </div>
  );
};

export default MainLayout;


