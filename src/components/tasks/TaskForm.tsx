import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Task } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import Button from '../ui/Button';

interface TaskFormProps {
  onClose: () => void;
  onSuccess?: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const { createTask } = useTaskStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    priority: 'medium',
    dueDate: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) return null;
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان المهمة مطلوب';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'وصف المهمة مطلوب';
    }
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'اسم العميل مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the task
      const newTask = createTask({
        title: formData.title,
        description: formData.description,
        clientName: formData.clientName,
        priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        status: 'new',
        createdBy: user.id,
      });
      
      if (onSuccess) {
        onSuccess(newTask);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      setErrors({ submit: 'حدث خطأ أثناء إنشاء المهمة. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4 animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">إنشاء مهمة جديدة</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                عنوان المهمة*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                اسم العميل*
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.clientName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                وصف المهمة*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  الأولوية
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">عاجلة</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  تاريخ التسليم
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            )}
          </div>
          
          <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              إنشاء المهمة
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;