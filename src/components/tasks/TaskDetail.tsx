import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  X, 
  FileText, 
  Paperclip, 
  Send, 
  ArrowLeft, 
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';
import { Task, TaskStatus, User } from '../../types';
import { 
  getStatusLabel, 
  getStatusColor, 
  getPriorityLabel, 
  getPriorityColor,
  getAllowedNextStatuses,
  getUserByDepartment
} from '../../mocks/data';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose }) => {
  const { user } = useAuthStore();
  const { updateTaskStatus, addTaskComment } = useTaskStore();
  
  const [comment, setComment] = useState('');
  const [statusChangeComment, setStatusChangeComment] = useState('');
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  
  if (!user) return null;
  
  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority);
  
  // Get creator from mock data
  const creator = getUserByDepartment('sales');
  
  // Get user by ID
  const getUserById = (userId: string): User => {
    return users.find(u => u.id === userId) || creator;
  };
  
  // Get allowed next statuses based on current status and user department
  const allowedNextStatuses = getAllowedNextStatuses(task.status, user.department);
  
  // Handle status change
  const handleStatusChange = () => {
    if (selectedStatus && user) {
      updateTaskStatus(task.id, selectedStatus, statusChangeComment);
      setShowStatusChange(false);
      setSelectedStatus(null);
      setStatusChangeComment('');
    }
  };
  
  // Handle comment submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (comment.trim() && user) {
      addTaskComment(task.id, comment, user.id);
      setComment('');
    }
  };
  
  // Get users for mock data
  const users = [creator, getUserByDepartment('design'), getUserByDepartment('management'), getUserByDepartment('production')];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end overflow-hidden">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={statusColor}>
                {getStatusLabel(task.status)}
              </Badge>
              <Badge className={priorityColor}>
                {getPriorityLabel(task.priority)}
              </Badge>
            </div>
            
            <h3 className="text-lg font-medium mb-1">معلومات العميل</h3>
            <p className="text-gray-700 mb-3">{task.clientName}</p>
            
            <h3 className="text-lg font-medium mb-1">الوصف</h3>
            <p className="text-gray-700 mb-3">{task.description}</p>
            
            <div className="flex flex-wrap justify-between text-sm text-gray-500 mb-6">
              <div>
                <span className="font-medium">تاريخ الإنشاء:</span>{' '}
                {format(task.createdAt, 'yyyy/MM/dd HH:mm')}
              </div>
              {task.dueDate && (
                <div>
                  <span className="font-medium">تاريخ التسليم:</span>{' '}
                  {format(task.dueDate, 'yyyy/MM/dd')}
                </div>
              )}
            </div>
            
            {allowedNextStatuses.length > 0 && (
              <div className="mb-6">
                {showStatusChange ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">تغيير حالة المهمة</h3>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {allowedNextStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`
                              px-3 py-1 rounded-full text-sm font-medium
                              ${selectedStatus === status 
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }
                            `}
                          >
                            {getStatusLabel(status)}
                            {status === 'in_sales' && <ArrowRight className="inline mr-1\" size={16} />}
                            {status === 'in_design' && <ArrowRight className="inline mr-1" size={16} />}
                            {status === 'in_management' && <ArrowRight className="inline mr-1\" size={16} />}
                            {status === 'in_production' && <ArrowRight className="inline mr-1" size={16} />}
                            {status === 'completed' && <CornerDownLeft className="inline mr-1\" size={16} />}
                          </button>
                        ))}
                      </div>
                      
                      <textarea
                        value={statusChangeComment}
                        onChange={(e) => setStatusChangeComment(e.target.value)}
                        placeholder="أضف تعليقاً (اختياري)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={2}
                      />
                      
                      <div className="flex justify-end space-x-2 space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowStatusChange(false);
                            setSelectedStatus(null);
                          }}
                        >
                          إلغاء
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleStatusChange}
                          disabled={!selectedStatus}
                        >
                          تأكيد
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowStatusChange(true)}
                    className="w-full"
                  >
                    تغيير حالة المهمة
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">الملفات المرفقة</h3>
            {task.files.length === 0 ? (
              <p className="text-gray-500 text-sm">لا توجد ملفات مرفقة</p>
            ) : (
              <div className="space-y-2">
                {task.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center p-3 border border-gray-200 rounded-md"
                  >
                    <FileText size={20} className="text-gray-400 ml-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {format(file.uploadedAt, 'yyyy/MM/dd HH:mm')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // In a real app, this would download the file
                        alert('تنزيل الملف: ' + file.name);
                      }}
                    >
                      تنزيل
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">سجل النشاطات</h3>
            <div className="border-r-2 border-gray-200 pr-4 space-y-4">
              {task.logs.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute right-0 top-1 w-3 h-3 bg-indigo-600 rounded-full transform -translate-y-1/2 -translate-x-1/2" />
                  <div className="pr-4">
                    <p className="text-sm font-medium">{log.action}</p>
                    {log.fromStatus && log.toStatus && (
                      <p className="text-xs text-gray-600">
                        من {getStatusLabel(log.fromStatus)} إلى{' '}
                        {getStatusLabel(log.toStatus)}
                      </p>
                    )}
                    {log.comment && (
                      <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                        {log.comment}
                      </p>
                    )}
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-500">
                        {format(log.performedAt, 'yyyy/MM/dd HH:mm')}
                      </p>
                      <span className="mx-1 text-gray-300">•</span>
                      <p className="text-xs text-gray-500">
                        بواسطة: {getUserById(log.performedBy).name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">التعليقات</h3>
            <div className="space-y-4 mb-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    {getUserById(comment.createdBy).avatar ? (
                      <img
                        src={getUserById(comment.createdBy).avatar}
                        alt={getUserById(comment.createdBy).name}
                        className="h-6 w-6 rounded-full ml-2"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center ml-2">
                        <span className="text-white text-xs">
                          {getUserById(comment.createdBy).name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {getUserById(comment.createdBy).name}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {format(comment.createdAt, 'yyyy/MM/dd HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
              
              {task.comments.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  لا توجد تعليقات حتى الآن
                </p>
              )}
            </div>
            
            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 space-x-reverse">
              <div className="relative flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="أضف تعليقاً..."
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                  rows={2}
                />
                <button
                  type="button"
                  className="absolute left-2 top-2 text-gray-400 hover:text-gray-600"
                >
                  <Paperclip size={18} />
                </button>
              </div>
              <Button
                type="submit"
                disabled={!comment.trim()}
                rightIcon={<Send size={16} />}
              >
                إرسال
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;