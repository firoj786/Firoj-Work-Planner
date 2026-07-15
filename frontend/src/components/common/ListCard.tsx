import type { ReactNode } from 'react';
import ScrollPanel from '@/components/common/ScrollPanel';
import { LIST_CARD_HEIGHT } from '@/components/common/scrollDefaults';

interface ListCardProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  scrollHeight?: number | string;
  style?: React.CSSProperties;
}

const DEFAULT_SCROLL_HEIGHT = LIST_CARD_HEIGHT;

/**
 * Card with a fixed header and Mantine scrollable body for list/table content.
 */
export default function ListCard({
  title,
  children,
  className,
  scrollHeight = DEFAULT_SCROLL_HEIGHT,
  style,
}: ListCardProps): React.ReactElement {
  return (
    <div className={`list-card${className ? ` ${className}` : ''}`} style={style}>
      {title != null && title !== '' && (
        <div className="list-card__header">{title}</div>
      )}
      <ScrollPanel className="list-card__scroll" h={scrollHeight}>
        <div className="list-card__body">{children}</div>
      </ScrollPanel>
    </div>
  );
}
