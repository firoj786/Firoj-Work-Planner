export interface TaskRow {
  pk_id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  reminder_at: Date | null;
  labels: string | null;
  color: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface NoteRow {
  pk_id: number;
  title: string;
  content: string | null;
  tags: string | null;
  category: string | null;
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface KnowledgeRow {
  pk_id: number;
  title: string;
  content: string | null;
  category: string | null;
  tags: string | null;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserRow {
  pk_id: number;
  name: string;
  email: string;
  subscription: string;
  role: string;
}

function formatDate(value: Date | string | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date(value).toISOString();
}

function formatDateOnly(value: string | Date | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }
  return value.toISOString().slice(0, 10);
}

export function mapTask(row: TaskRow) {
  return {
    id: row.pk_id,
    title: row.title,
    description: row.description ?? undefined,
    priority: row.priority,
    status: row.status,
    dueDate: formatDateOnly(row.due_date),
    reminderAt: formatDate(row.reminder_at),
    labels: row.labels ?? undefined,
    color: row.color ?? undefined,
    createdAt: formatDate(row.created_at)!,
    updatedAt: formatDate(row.updated_at)!,
  };
}

export function mapNote(row: NoteRow) {
  return {
    id: row.pk_id,
    title: row.title,
    content: row.content ?? undefined,
    tags: row.tags ?? undefined,
    category: row.category ?? undefined,
    pinned: row.pinned,
    favorite: row.favorite,
    archived: row.archived,
    createdAt: formatDate(row.created_at)!,
    updatedAt: formatDate(row.updated_at)!,
  };
}

export function mapKnowledge(row: KnowledgeRow) {
  return {
    id: row.pk_id,
    title: row.title,
    content: row.content ?? undefined,
    category: row.category ?? undefined,
    tags: row.tags ?? undefined,
    version: row.version,
    createdAt: formatDate(row.created_at)!,
    updatedAt: formatDate(row.updated_at)!,
  };
}

export function mapUser(row: UserRow) {
  return {
    id: row.pk_id,
    name: row.name,
    email: row.email,
    subscription: row.subscription,
    role: row.role,
  };
}
