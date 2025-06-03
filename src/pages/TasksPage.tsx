import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { TaskStatus } from '../types';
import { getTasksByDepartment, getStatusLabel } from '../mocks/data';
import Button from '../components/ui/Button';
import TaskList from '../components/tasks/TaskList';
import TaskDetail from '../components/tasks/TaskDetail';
import TaskForm from '../components/tasks/TaskForm';

const TasksPage: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, setSelectedTask, selectedTask } = useTaskStore();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  useEffect(() => {
    if (user) {
      let departmentTasks = getTasksByDepartment(user.department);
      
      // Apply status filter
      if (statusFilter !== 'all') {
        departmentTasks = departmentTasks.filter(
          (task) => task.status === statusFilter
        );
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        departmentTasks = departmentTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.clientName.toLowerCase().includes(query)
        );
      }
      
      setFilteredTasks(departmentTasks);
    }
  }, [user, tasks, statusFilter, searchQuery]);
  
  if (!user) return null;
  
  // Check if user can create tasks (only Sales department can)
  const canCreateTask = user.department === 'sales';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          المهام
        </h1>
        
        {canCreateTask && (
          <Button
            onClick={() => setShowTaskForm(true)}
            leftIcon={<Plus size={18} />}
          >
            مهمة جديدة
          </Button>
        )}
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="بحث عن المهام..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pr-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="w-full md:w-64">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="new">جديدة</option>
              <option value="in_sales">في المبيعات</option>
              <option value="in_design">في التصميم</option>
              <option value="in_management">في الإدارة</option>
              <option value="in_production">في الإنتاج</option>
              <option value="completed">مكتملة</option>
            </select>
          </div>
        </div>
      </div>
      
      <TaskList
        tasks={filteredTasks}
        onTaskSelect={(task) => setSelectedTask(task)}
        emptyMessage={
          searchQuery
            ? 'لا توجد نتائج مطابقة للبحث'
            : 'لا توجد مهام حالياً'
        }
      />
      
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
      
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSuccess={() => {
            setShowTaskForm(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};

export default TasksPage;