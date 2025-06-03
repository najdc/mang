export type Department = 'sales' | 'design' | 'management' | 'production';

export type TaskStatus = 
  | 'new' 
  | 'in_sales' 
  | 'in_design' 
  | 'in_management' 
  | 'in_production' 
  | 'completed';

export type User = {
  id: string;
  name: string;
  email: string;
  department: Department;
  avatar?: string;
};

export type TaskFile = {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
};

export type TaskComment = {
  id: string;
  text: string;
  createdBy: string;
  createdAt: Date;
};

export type TaskLog = {
  id: string;
  action: string;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  performedBy: string;
  performedAt: Date;
  comment?: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  clientName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TaskStatus;
  dueDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  files: TaskFile[];
  comments: TaskComment[];
  logs: TaskLog[];
};

export type Notification = {
  id: string;
  message: string;
  taskId: string;
  userId: string;
  createdAt: Date;
  read: boolean;
};