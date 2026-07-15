import { ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import GlobalSearch from '@/components/common/GlobalSearch';
import { ICON_SIZE_NAV, MOBILE_NAV_ITEMS } from '@/utils/navItems';

const pageTitles: Record<string, string> = Object.fromEntries(
  MOBILE_NAV_ITEMS.map((item) => [item.to, item.label]).concat([['/settings', 'Settings']]),
);

export default function Navbar(): React.ReactElement {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'WorkPilot';

  return (
    <header className="navbar">
      <div className="navbar__title">{title}</div>
      <div className="navbar__actions">
        <GlobalSearch />
      </div>
    </header>
  );
}

export function MobileNav(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {MOBILE_NAV_ITEMS.slice(0, 2).map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={ICON_SIZE_NAV} stroke={1.75} />
            {item.mobileLabel ?? item.label}
          </NavLink>
        );
      })}
      <ActionIcon
        className="mobile-nav__fab"
        radius="xl"
        size="xl"
        variant="gradient"
        gradient={{ from: 'blue', to: 'violet', deg: 135 }}
        onClick={() => navigate(MOBILE_NAV_ITEMS[1]?.to ?? '/planner')}
        aria-label="Quick add task"
      >
        <IconPlus size={22} stroke={2} />
      </ActionIcon>
      {MOBILE_NAV_ITEMS.slice(2).map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={ICON_SIZE_NAV} stroke={1.75} />
            {item.mobileLabel ?? item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
