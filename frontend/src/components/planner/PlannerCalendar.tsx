import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import ListCard from '@/components/common/ListCard';
import type { Task } from '@/services/types';
import { LIST_CARD_HEIGHT } from '@/components/common/scrollDefaults';

interface PlannerCalendarProps {
  tasks: Task[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

/**
 * Renders a Mantine calendar with due-date markers and a list of tasks for the selected day.
 */
export default function PlannerCalendar({
  tasks,
  selectedDate,
  onSelectDate,
}: PlannerCalendarProps): React.ReactElement {
  const dueDateSet = useMemo(() => {
    return new Set(tasks.filter((task) => task.dueDate).map((task) => task.dueDate as string));
  }, [tasks]);

  const tasksForSelectedDay = useMemo(() => {
    if (!selectedDate) {
      return [];
    }
    return tasks.filter((task) => task.dueDate === selectedDate);
  }, [tasks, selectedDate]);

  return (
    <div className="planner-calendar">
      <div className="planner-calendar__picker card">
        <DatePicker
          size="md"
          value={selectedDate}
          onChange={onSelectDate}
          getDayProps={(date) => {
            const hasTasks = dueDateSet.has(date);
            return {
              selected: selectedDate === date,
              style: hasTasks
                ? { fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4 }
                : undefined,
            };
          }}
        />
      </div>
      <ListCard
        className="planner-calendar__tasks"
        title={selectedDate ? dayjs(selectedDate).format('MMMM D, YYYY') : 'Select a date'}
        scrollHeight={LIST_CARD_HEIGHT}
      >
        {tasksForSelectedDay.length === 0 ? (
          <div className="empty-state">No tasks due on this day</div>
        ) : (
          tasksForSelectedDay.map((task) => (
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
    </div>
  );
}
