import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Button, Group, SegmentedControl } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconCalendar,
  IconCheck,
  IconLayoutKanban,
  IconList,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import FormModal from '@/components/common/FormModal';
import { FormModalActions, FormModalForm } from '@/components/common/FormModalActions';
import ListCard from '@/components/common/ListCard';
import ScrollPanel from '@/components/common/ScrollPanel';
import { LIST_CARD_HEIGHT, PAGE_PANEL_HEIGHT } from '@/components/common/scrollDefaults';
import PlannerCalendar from '@/components/planner/PlannerCalendar';
import { api } from '@/services/api';
import type { Task, TaskPriority, TaskStatus, UpdateTaskPayload } from '@/services/types';
import { ICON_SIZE } from '@/utils/navItems';

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'];
const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const statusLabel: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  BLOCKED: 'Blocked',
};

type PlannerView = 'board' | 'list' | 'calendar';

export default function PlannerPage(): React.ReactElement {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<PlannerView>('board');
  const [calendarDate, setCalendarDate] = useState<string | null>(dayjs().format('YYYY-MM-DD'));
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [dueDate, setDueDate] = useState<string | null>(null);

  async function loadTasks(): Promise<void> {
    try {
      setTasks(await api.getTasks());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  const grouped = useMemo(() => {
    return STATUSES.reduce<Record<TaskStatus, Task[]>>((acc, s) => {
      acc[s] = tasks.filter((t) => t.status === s);
      return acc;
    }, { TODO: [], IN_PROGRESS: [], COMPLETED: [], BLOCKED: [] });
  }, [tasks]);

  function openCreate(): void {
    setEditing(null);
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setStatus('TODO');
    setDueDate(null);
    setShowModal(true);
  }

  function openEdit(task: Task): void {
    setEditing(task);
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate ?? null);
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    const payload: UpdateTaskPayload = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ?? undefined,
    };
    try {
      if (editing) {
        await api.updateTask(editing.id, payload);
      } else {
        await api.createTask(payload);
      }
      setShowModal(false);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function handleDelete(id: number): Promise<void> {
    if (!window.confirm('Delete this task?')) return;
    await api.deleteTask(id);
    await loadTasks();
  }

  async function moveTask(task: Task, newStatus: TaskStatus): Promise<void> {
    await api.updateTask(task.id, {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: newStatus,
      dueDate: task.dueDate,
      labels: task.labels,
    });
    await loadTasks();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Planner</h1>
          <p className="text-muted">Manage your work using Board, List, or Calendar view.</p>
        </div>
        <Group gap="sm" wrap="wrap">
          <SegmentedControl
            value={view}
            onChange={(value) => setView(value as PlannerView)}
            data={[
              {
                value: 'board',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <IconLayoutKanban size={14} stroke={1.75} />
                    Board
                  </Group>
                ),
              },
              {
                value: 'list',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <IconList size={14} stroke={1.75} />
                    List
                  </Group>
                ),
              },
              {
                value: 'calendar',
                label: (
                  <Group gap={6} wrap="nowrap">
                    <IconCalendar size={14} stroke={1.75} />
                    Calendar
                  </Group>
                ),
              },
            ]}
          />
          <Button leftSection={<IconPlus size={ICON_SIZE} stroke={1.75} />} onClick={openCreate}>
            New Task
          </Button>
        </Group>
      </div>

      {error && <p className="form-error">{error}</p>}

      {view === 'calendar' ? (
        <PlannerCalendar
          tasks={tasks}
          selectedDate={calendarDate}
          onSelectDate={setCalendarDate}
        />
      ) : view === 'board' ? (
        <ScrollPanel className="board-scroll" scrollbars="x">
          <div className="board">
            {STATUSES.map((columnStatus) => (
              <div key={columnStatus} className="board-column">
                <div className="board-column__title">{statusLabel[columnStatus]}</div>
                <ScrollPanel h={PAGE_PANEL_HEIGHT}>
                  {grouped[columnStatus].map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-card__title">{task.title}</div>
                  <div className="task-card__meta">
                    <span className={`badge badge--${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </div>
                  <Group gap={6} mt="sm" wrap="wrap">
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      leftSection={<IconPencil size={14} stroke={1.75} />}
                      onClick={() => openEdit(task)}
                    >
                      Edit
                    </Button>
                    {columnStatus !== 'COMPLETED' && (
                      <Button
                        size="compact-xs"
                        variant="subtle"
                        color="teal"
                        leftSection={<IconCheck size={14} stroke={1.75} />}
                        onClick={() => void moveTask(task, 'COMPLETED')}
                      >
                        Done
                      </Button>
                    )}
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="red"
                      leftSection={<IconTrash size={14} stroke={1.75} />}
                      onClick={() => void handleDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </Group>
                </div>
                  ))}
                </ScrollPanel>
              </div>
            ))}
          </div>
        </ScrollPanel>
      ) : (
        <ListCard scrollHeight={LIST_CARD_HEIGHT}>
            {tasks.length === 0 ? (
              <div className="empty-state">No tasks yet</div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-card__title">{task.title}</div>
                  <div className="task-card__meta">
                    <span className={`badge badge--${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <span className={`badge badge--${task.status === 'IN_PROGRESS' ? 'progress' : task.status === 'COMPLETED' ? 'done' : task.status === 'BLOCKED' ? 'blocked' : 'todo'}`}>
                      {statusLabel[task.status]}
                    </span>
                    {task.dueDate && <span className="text-sm text-muted">Due {task.dueDate}</span>}
                  </div>
                  <Group gap={6} mt="sm">
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      leftSection={<IconPencil size={14} stroke={1.75} />}
                      onClick={() => openEdit(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      color="red"
                      leftSection={<IconTrash size={14} stroke={1.75} />}
                      onClick={() => void handleDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </Group>
                </div>
              ))
            )}
        </ListCard>
      )}

      <FormModal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Task' : 'New Task'}
      >
        <FormModalForm onSubmit={(e) => void handleSubmit(e)}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title</label>
            <input id="task-title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Description</label>
            <textarea id="task-desc" className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">Priority</label>
            <select id="task-priority" className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="task-status">Status</label>
            <select id="task-status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <DateInput
              value={dueDate}
              onChange={setDueDate}
              placeholder="Pick due date"
              clearable
              popoverProps={{ withinPortal: true }}
            />
          </div>
          <FormModalActions onCancel={() => setShowModal(false)} />
        </FormModalForm>
      </FormModal>
    </div>
  );
}
