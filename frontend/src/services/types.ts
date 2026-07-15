export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  subscription: string;
  role: string;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  reminderAt?: string;
  labels?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: number;
  title: string;
  content?: string;
  tags?: string;
  category?: string;
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  content?: string;
  category?: string;
  tags?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  todaysTasks: number;
  pendingTasks: number;
  completedTasks: number;
  notesCount: number;
  knowledgeCount: number;
  upcomingTasks: Task[];
  recentNotes: Note[];
  recentActivity: { type: string; title: string; timestamp: string }[];
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  subscription: string;
  role: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  labels?: string;
}

export interface UpdateTaskPayload extends CreateTaskPayload {
  status: TaskStatus;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tags?: string;
  category?: string;
  pinned?: boolean;
  favorite?: boolean;
}

export interface UpdateNotePayload extends CreateNotePayload {
  archived?: boolean;
}

export interface CreateKnowledgePayload {
  title: string;
  content?: string;
  category?: string;
  tags?: string;
}
