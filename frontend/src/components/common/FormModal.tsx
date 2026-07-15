import { Modal, type ModalProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface FormModalProps extends Pick<ModalProps, 'size' | 'centered'> {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Standard modal shell with Mantine close control and consistent spacing.
 */
export default function FormModal({
  opened,
  onClose,
  title,
  children,
  size = 'md',
  centered = true,
}: FormModalProps): React.ReactElement {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
      radius="lg"
      padding="lg"
    >
      {children}
    </Modal>
  );
}
