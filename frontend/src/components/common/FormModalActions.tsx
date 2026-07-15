import { Button, Group } from '@mantine/core';
import { IconDeviceFloppy, IconX } from '@tabler/icons-react';
import type { FormEvent, ReactNode } from 'react';
import { ICON_SIZE } from '@/utils/navItems';

interface FormModalActionsProps {
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

/**
 * Renders cancel and submit actions for form modals.
 */
export function FormModalActions({
  onCancel,
  submitLabel = 'Save',
  loading = false,
}: FormModalActionsProps): React.ReactElement {
  return (
    <Group justify="flex-end" mt="md">
      <Button
        variant="default"
        leftSection={<IconX size={ICON_SIZE} stroke={1.75} />}
        onClick={onCancel}
        type="button"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        leftSection={<IconDeviceFloppy size={ICON_SIZE} stroke={1.75} />}
        loading={loading}
      >
        {submitLabel}
      </Button>
    </Group>
  );
}

interface FormModalFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function FormModalForm({ onSubmit, children }: FormModalFormProps): React.ReactElement {
  return (
    <form className="form" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
