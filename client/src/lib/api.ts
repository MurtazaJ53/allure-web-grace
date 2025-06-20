// API client for communicating with our backend
const API_BASE_URL = '';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.error || 'Request failed');
  }

  return response.json();
}

// Profile API
export const profileApi = {
  get: () => 
    apiRequest<any>('/api/auth/user'),
  
  update: (data: any) =>
    apiRequest<any>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Tasks API
export const tasksApi = {
  list: () =>
    apiRequest<any[]>('/api/tasks'),
  
  create: (task: any) =>
    apiRequest<any>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  
  update: (id: string, task: any) =>
    apiRequest<any>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    }),
};

// Habits API
export const habitsApi = {
  list: () =>
    apiRequest<any[]>('/api/habits'),
  
  create: (habit: any) =>
    apiRequest<any>('/api/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    }),
  
  update: (id: string, habit: any) =>
    apiRequest<any>(`/api/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habit),
    }),
  
  delete: (id: string) =>
    apiRequest<void>(`/api/habits/${id}`, {
      method: 'DELETE',
    }),
};

// Activities API
export const activitiesApi = {
  list: () =>
    apiRequest<any[]>('/api/activities'),
  
  create: (activity: any) =>
    apiRequest<any>('/api/activities', {
      method: 'POST',
      body: JSON.stringify(activity),
    }),
};