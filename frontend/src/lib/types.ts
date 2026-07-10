export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  projects?: Project[];
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  clientId: number;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  projectId: number;
  assigneeId?: number;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  assignee?: TeamMember;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
}