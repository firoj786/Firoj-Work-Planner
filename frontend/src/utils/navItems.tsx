import {
  IconBooks,
  IconCheckbox,
  IconLayoutDashboard,
  IconNotes,
  IconSettings,
} from '@tabler/icons-react';
import type { TablerIcon } from '@tabler/icons-react';
import { ROUTES } from '@/utils/constants';

export const ICON_SIZE = 18;
export const ICON_SIZE_NAV = 20;

export interface NavItemConfig {
  to: string;
  label: string;
  mobileLabel?: string;
  icon: TablerIcon;
}

export const NAV_ITEMS: NavItemConfig[] = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', mobileLabel: 'Home', icon: IconLayoutDashboard },
  { to: ROUTES.PLANNER, label: 'Planner', icon: IconCheckbox },
  { to: ROUTES.NOTES, label: 'Notes', icon: IconNotes },
  { to: ROUTES.KNOWLEDGE, label: 'Knowledge', mobileLabel: 'Wiki', icon: IconBooks },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: IconSettings },
];

export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.to !== ROUTES.SETTINGS);
