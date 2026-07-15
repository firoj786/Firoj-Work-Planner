import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import ListCard from '@/components/common/ListCard';
import ScrollPanel from '@/components/common/ScrollPanel';
import { LIST_CARD_HEIGHT } from '@/components/common/scrollDefaults';
import { api } from '@/services/api';
import type { DashboardData, Task } from '@/services/types';
import { ROUTES } from '@/utils/constants';
import { ICON_SIZE } from '@/utils/navItems';

export default function DashboardPage(): React.ReactElement {
  const [data, setData] = useState<DashboardData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(dayjs().format('YYYY-MM-DD'));
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getTasks()])
      .then(([dashboard, allTasks]) => {
        setData(dashboard);
        setTasks(allTasks);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const dueDateSet = useMemo(
    () => new Set(tasks.filter((task) => task.dueDate).map((task) => task.dueDate as string)),
    [tasks],
  );

  const tasksForDay = useMemo(() => {
    if (!selectedDate) {
      return [];
    }
    return tasks.filter((task) => task.dueDate === selectedDate);
  }, [tasks, selectedDate]);

  if (error) {
    return <div className="empty-state">{error}</div>;
  }

  if (!data) {
    return <div className="empty-state">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted">Your productivity at a glance</p>
        </div>
        <Button
          component={Link}
          to={ROUTES.PLANNER}
          leftSection={<IconPlus size={ICON_SIZE} stroke={1.75} />}
        >
          New Task
        </Button>
      </div>

      <div className="page-grid page-grid--stats">
        <div className="stat-card">
          <span className="stat-card__label">Today&apos;s Tasks</span>
          <span className="stat-card__value">{data.todaysTasks}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Pending</span>
          <span className="stat-card__value">{data.pendingTasks}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Completed</span>
          <span className="stat-card__value">{data.completedTasks}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Notes</span>
          <span className="stat-card__value">{data.notesCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Knowledge</span>
          <span className="stat-card__value">{data.knowledgeCount}</span>
        </div>
      </div>

      <div className="page-grid page-grid--two dashboard-calendar-row">
        <ListCard title="Upcoming Tasks" scrollHeight={LIST_CARD_HEIGHT}>
          {data.upcomingTasks.length === 0 ? (
            <div className="empty-state">No upcoming tasks</div>
          ) : (
            data.upcomingTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-card__title">{task.title}</div>
                <div className="task-card__meta">
                  <span className={`badge badge--${task.priority.toLowerCase()}`}>{task.priority}</span>
                  <span className={`badge badge--${task.status === 'IN_PROGRESS' ? 'progress' : task.status === 'COMPLETED' ? 'done' : task.status === 'BLOCKED' ? 'blocked' : 'todo'}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </ListCard>

        <div className="card dashboard-calendar">
          <h3 className="dashboard-calendar__title">Calendar</h3>
          <DatePicker
            size="sm"
            value={selectedDate}
            onChange={setSelectedDate}
            getDayProps={(date) => ({
              selected: selectedDate === date,
              style: dueDateSet.has(date)
                ? { fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }
                : undefined,
            })}
          />
          <ScrollPanel h={160}>
            <div className="dashboard-calendar__list">
              {tasksForDay.length === 0 ? (
                <p className="text-sm text-muted">No tasks on this day</p>
              ) : (
                tasksForDay.map((task) => (
                  <div key={task.id} className="text-sm">{task.title}</div>
                ))
              )}
            </div>
          </ScrollPanel>
        </div>
      </div>

      <ListCard title="Recent Activity" scrollHeight={LIST_CARD_HEIGHT} style={{ marginTop: '1rem' }}>
        <div className="activity-list">
          {data.recentActivity.length === 0 ? (
            <div className="empty-state">No recent activity</div>
          ) : (
            data.recentActivity.map((item, index) => (
              <div key={`${item.type}-${index}`} className="activity-item">
                <div>
                  <strong>{item.title}</strong>
                  <div className="text-sm text-muted">{item.type}</div>
                </div>
                <span className="text-sm text-muted">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </ListCard>
    </div>
  );
}
