import React, { useEffect, useState } from 'react';
import { BarChart, PieChart, Clock, ArrowUp, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types';
import { getStatusLabel, getTasksByDepartment, getDepartmentLabel } from '../mocks/data';
import Card from '../components/ui/Card';
import TaskList from '../components/tasks/TaskList';
import TaskDetail from '../components/tasks/TaskDetail';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, setSelectedTask, selectedTask } = useTaskStore();
  
  const [departmentTasks, setDepartmentTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  useEffect(() => {
    if (user) {
      setDepartmentTasks(getTasksByDepartment(user.department));
    }
  }, [user, tasks]);
  
  if (!user) return null;
  
  // Get urgent tasks
  const urgentTasks = departmentTasks.filter(
    (task) => task.priority === 'urgent' || task.priority === 'high'
  );
  
  // Get tasks by status for current department
  const tasksByStatus = departmentTasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  
  // Get recent tasks
  const recentTasks = [...departmentTasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);
  
  // Calculate statistics
  const totalTasks = departmentTasks.length;
  const completedTasks = departmentTasks.filter(
    (task) => task.status === 'completed'
  ).length;
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          مرحباً، {user.name}
        </h1>
        <p className="text-gray-600">
          لوحة تحكم قسم {getDepartmentLabel(user.department)}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Content className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 ml-4">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المهام</p>
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 ml-4">
              <PieChart size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">نسبة الإنجاز</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600 ml-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">قيد التنفيذ</p>
              <p className="text-2xl font-bold">
                {departmentTasks.filter(t => 
                  t.status !== 'completed' && 
                  t.status !== 'new'
                ).length}
              </p>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 ml-4">
              <ArrowUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">مهام عاجلة</p>
              <p className="text-2xl font-bold">{urgentTasks.length}</p>
            </div>
          </Card.Content>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title>حالة المهام</Card.Title>
              <Card.Description>توزيع المهام حسب حالتها</Card.Description>
            </Card.Header>
            <Card.Content className="min-h-[200px]">
              <div className="flex flex-wrap gap-4 justify-around">
                {Object.entries(tasksByStatus).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-800 text-xl font-bold mb-2">
                      {count}
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {getStatusLabel(status as any)}
                    </p>
                  </div>
                ))}
                
                {Object.keys(tasksByStatus).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد بيانات</p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <Card.Header>
              <Card.Title>المهام العاجلة</Card.Title>
              <Card.Description>المهام ذات الأولوية العالية</Card.Description>
            </Card.Header>
            <Card.Content>
              {urgentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">لا توجد مهام عاجلة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {urgentTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {task.title}
                        </h4>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {task.priority === 'urgent' ? 'عاجل' : 'مهم'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {task.clientName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          المهام الأخيرة
        </h2>
        
        <TaskList
          tasks={recentTasks}
          onTaskSelect={(task) => setSelectedTask(task)}
          emptyMessage="لا توجد مهام حديثة"
        />
      </div>
      
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;