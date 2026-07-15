import { NavLink } from 'react-router-dom';
import { Button } from '@mantine/core';
import { IconLogout, IconPlane } from '@tabler/icons-react';
import { APP_NAME, APP_TAGLINE } from '@/utils/constants';
import { ICON_SIZE, ICON_SIZE_NAV, NAV_ITEMS } from '@/utils/navItems';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar(): React.ReactElement {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-row">
          <IconPlane size={22} stroke={1.75} className="sidebar__brand-icon" />
          <h1>{APP_NAME}</h1>
        </div>
        <span>{APP_TAGLINE}</span>
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            >
              <Icon size={ICON_SIZE_NAV} stroke={1.75} className="sidebar__link-icon" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar__footer">
        <div className="user-name">{user?.name}</div>
        <div className="user-email">{user?.email}</div>
        <Button
          variant="default"
          fullWidth
          mt="sm"
          leftSection={<IconLogout size={ICON_SIZE} stroke={1.75} />}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
