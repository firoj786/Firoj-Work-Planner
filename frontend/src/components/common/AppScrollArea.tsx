import { ScrollArea } from '@mantine/core';
import type { ReactNode } from 'react';
import { scrollDefaults } from '@/components/common/scrollDefaults';

interface AppScrollAreaProps {
  children: ReactNode;
}

/**
 * Main page scroll container below the navbar.
 */
export default function AppScrollArea({ children }: AppScrollAreaProps): React.ReactElement {
  return (
    <ScrollArea
      className="app-content-scroll"
      flex={1}
      {...scrollDefaults}
    >
      <div className="app-content">{children}</div>
    </ScrollArea>
  );
}
