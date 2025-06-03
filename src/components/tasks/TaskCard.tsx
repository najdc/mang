import React from 'react';
import { Clock, FileText, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '../../types';
import { 
  getStatusLabel, 
  getStatusColor, 
  getPriorityLabel, 
  getPriorityColor, 
  getUserByDepartment 
} from '../../mocks/data';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority);
  
  const creator = getUserByDepartment('sales');
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <Card.Header className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Card.Title className="truncate">{task.title}</Card.Title>
          <Badge className={statusColor}>
            {getStatusLabel(task.status)}
          </Badge>
        </div>
        <Card.Description>
          {task.clientName}
        </Card.Description>
      </Card.Header>
      
      <Card.Content className="pt-3 pb-3">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={priorityColor}>
            {getPriorityLabel(task.priority)}
          </Badge>
          
          {task.dueDate && (
            <Badge variant="outline" className="flex items-center">
              <Clock size={12} className="ml-1" />
              {format(task.dueDate, 'yyyy/MM/dd')}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <FileText size={14} className="ml-1" />
            {task.files.length} ملفات
          </div>
          
          <div className="flex items-center">
            <MessageSquare size={14} className="ml-1" />
            {task.comments.length} تعليقات
          </div>
        </div>
      </Card.Content>
      
      <Card.Footer className="bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 ml-1">بواسطة:</span>
            {creator.avatar ? (
              <img
                src={creator.avatar}
                alt={creator.name}
                className="h-5 w-5 rounded-full ml-1"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center ml-1">
                <span className="text-white text-xs">
                  {creator.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs font-medium text-gray-700">
              {creator.name}
            </span>
          </div>
          
          <span className="text-xs text-gray-500">
            {format(task.createdAt, 'yyyy/MM/dd')}
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default TaskCard;