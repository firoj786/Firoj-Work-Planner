import { Outlet } from 'react-router-dom';
import AppScrollArea from '@/components/common/AppScrollArea';
import Sidebar from './Sidebar';
import Navbar, { MobileNav } from './Navbar';

export default function AppLayout(): React.ReactElement {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <AppScrollArea>
          <Outlet />
        </AppScrollArea>
      </div>
      <MobileNav />
    </div>
  );
}
