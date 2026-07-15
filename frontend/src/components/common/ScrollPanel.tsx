import { ScrollArea, type ScrollAreaProps } from '@mantine/core';
import type { ReactNode } from 'react';
import { scrollDefaults } from '@/components/common/scrollDefaults';

interface ScrollPanelProps extends Omit<ScrollAreaProps, 'children'> {
  children: ReactNode;
}

/**
 * Reusable Mantine scroll region for side panels, lists, and detail views.
 */
export default function ScrollPanel({
  children,
  className,
  ...props
}: ScrollPanelProps): React.ReactElement {
  return (
    <ScrollArea className={className} {...scrollDefaults} {...props}>
      {children}
    </ScrollArea>
  );
}
