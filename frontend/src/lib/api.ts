import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  },
);

export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getOne: (id: number) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients', data),
  update: (id: number, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
};

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id: number) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  getOne: (id: number) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  getByProject: (projectId: number) => api.get(`/tasks/project/${projectId}`),
  getByFilter: (params: any) => api.get('/tasks/filter', { params }),
};