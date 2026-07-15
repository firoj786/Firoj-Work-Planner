import axios from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  CreateKnowledgePayload,
  CreateNotePayload,
  CreateTaskPayload,
  DashboardData,
  KnowledgeArticle,
  Note,
  Task,
  UpdateNotePayload,
  UpdateTaskPayload,
  UserProfile,
} from './types';

const baseURL = import.meta.env.VITE_API_URL ?? '';

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('workpilot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise;
  if (!data.success) {
    throw new Error(data.message ?? 'Request failed');
  }
  return data.data;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    unwrap<AuthResponse>(client.post('/api/v1/auth/register', { name, email, password })),

  login: (email: string, password: string) =>
    unwrap<AuthResponse>(client.post('/api/v1/auth/login', { email, password })),

  getDashboard: () => unwrap<DashboardData>(client.get('/api/v1/dashboard')),

  getProfile: () => unwrap<UserProfile>(client.get('/api/v1/users/me')),

  getTasks: () => unwrap<Task[]>(client.get('/api/v1/tasks')),

  createTask: (payload: CreateTaskPayload) =>
    unwrap<Task>(client.post('/api/v1/tasks', payload)),

  updateTask: (id: number, payload: UpdateTaskPayload) =>
    unwrap<Task>(client.put(`/api/v1/tasks/${id}`, payload)),

  deleteTask: (id: number) => unwrap<null>(client.delete(`/api/v1/tasks/${id}`)),

  getNotes: () => unwrap<Note[]>(client.get('/api/v1/notes')),

  createNote: (payload: CreateNotePayload) =>
    unwrap<Note>(client.post('/api/v1/notes', payload)),

  updateNote: (id: number, payload: UpdateNotePayload) =>
    unwrap<Note>(client.put(`/api/v1/notes/${id}`, payload)),

  deleteNote: (id: number) => unwrap<null>(client.delete(`/api/v1/notes/${id}`)),

  getKnowledge: () => unwrap<KnowledgeArticle[]>(client.get('/api/v1/knowledge')),

  createKnowledge: (payload: CreateKnowledgePayload) =>
    unwrap<KnowledgeArticle>(client.post('/api/v1/knowledge', payload)),

  updateKnowledge: (id: number, payload: CreateKnowledgePayload) =>
    unwrap<KnowledgeArticle>(client.put(`/api/v1/knowledge/${id}`, payload)),

  deleteKnowledge: (id: number) => unwrap<null>(client.delete(`/api/v1/knowledge/${id}`)),
};

export function saveAuth(auth: AuthResponse): void {
  localStorage.setItem('workpilot_token', auth.token);
  localStorage.setItem('workpilot_user', JSON.stringify(auth));
}

export function clearAuth(): void {
  localStorage.removeItem('workpilot_token');
  localStorage.removeItem('workpilot_user');
}

export function getStoredUser(): AuthResponse | null {
  const raw = localStorage.getItem('workpilot_user');
  return raw ? (JSON.parse(raw) as AuthResponse) : null;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('workpilot_token');
}
