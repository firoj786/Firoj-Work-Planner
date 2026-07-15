import type { ScrollAreaProps } from '@mantine/core';

export const SCROLLBAR_SIZE = 8;

export const scrollDefaults: Pick<ScrollAreaProps, 'type' | 'offsetScrollbars' | 'scrollbarSize'> = {
  type: 'auto',
  offsetScrollbars: true,
  scrollbarSize: SCROLLBAR_SIZE,
};

export const PAGE_PANEL_HEIGHT = 'calc(100vh - 180px)';
export const LIST_CARD_HEIGHT = 'min(420px, calc(100vh - 280px))';
