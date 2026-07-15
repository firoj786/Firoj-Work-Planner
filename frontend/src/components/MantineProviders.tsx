import { DatesProvider } from '@mantine/dates';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { useTheme } from '@/context/ThemeContext';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, system-ui, sans-serif',
  defaultRadius: 'md',
});

function resolveColorScheme(mode: 'light' | 'dark' | 'system'): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

/**
 * Wraps the app with Mantine theming synced to the WorkPilot theme preference.
 */
export default function MantineProviders({ children }: { children: ReactNode }): React.ReactElement {
  const { theme: themeMode } = useTheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(() => resolveColorScheme(themeMode));

  useEffect(() => {
    setColorScheme(resolveColorScheme(themeMode));

    if (themeMode !== 'system') {
      return undefined;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (): void => setColorScheme(media.matches ? 'dark' : 'light');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [themeMode]);

  const mantineTheme = useMemo(() => theme, [theme]);

  return (
    <MantineProvider theme={mantineTheme} forceColorScheme={colorScheme}>
      <DatesProvider settings={{ firstDayOfWeek: 1, consistentWeeks: true }}>
        {children}
      </DatesProvider>
    </MantineProvider>
  );
}
