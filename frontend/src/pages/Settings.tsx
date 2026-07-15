import { useEffect, useState } from 'react';
import { SegmentedControl } from '@mantine/core';
import { api } from '@/services/api';
import type { UserProfile } from '@/services/types';
import { useAuth } from '@/context/AuthContext';
import { useTheme, type ThemeMode } from '@/context/ThemeContext';

export default function SettingsPage(): React.ReactElement {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => undefined);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="text-muted">Profile and preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-section">
          <h3>Profile</h3>
          <p><strong>Name:</strong> {profile?.name ?? user?.name}</p>
          <p><strong>Email:</strong> {profile?.email ?? user?.email}</p>
          <p><strong>Role:</strong> {profile?.role ?? user?.role ?? 'USER'}</p>
          <p><strong>Plan:</strong> {profile?.subscription ?? user?.subscription ?? 'FREE'}</p>
        </section>

        <section className="settings-section">
          <h3>Theme</h3>
          <SegmentedControl
            fullWidth
            value={theme}
            onChange={(value) => setTheme(value as ThemeMode)}
            data={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
