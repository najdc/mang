import { User, Task, Department, TaskStatus } from '../types';
import { format, subDays } from 'date-fns';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'أحمد محمود',
    email: 'ahmed@printshop.com',
    department: 'sales',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'سارة حسن',
    email: 'sara@printshop.com',
    department: 'design',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'محمد علي',
    email: 'mohamed@printshop.com',
    department: 'management',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    name: 'فاطمة أحمد',
    email: 'fatima@printshop.com',
    department: 'production',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Helper function to get a user by department
export const getUserByDepartment = (department: Department): User => {
  return users.find(user => user.department === department) || users[0];
};

// Mock Tasks
export const tasks: Task[] = [
  {
    id: '1',
    title: 'كتيب شركة الفجر للاستثمار',
    description: 'تصميم وطباعة كتيب تعريفي عن شركة الفجر للاستثمار بحجم A5 مكون من 12 صفحة',
    clientName: 'شركة الفجر للاستثمار',
    priority: 'high',
    status: 'in_design',
    dueDate: subDays(new Date(), -7),
    createdBy: '1',
    createdAt: subDays(new Date(), 5),
    updatedAt: subDays(new Date(), 3),
    assignedTo: '2',
    files: [
      {
        id: '101',
        name: 'المحتوى النصي.docx',
        url: '#',
        type: 'document',
        uploadedBy: '1',
        uploadedAt: subDays(new Date(), 5),
      }
    ],
    comments: [
      {
        id: '201',
        text: 'يرجى استخدام الألوان الرسمية للشركة في التصميم',
        createdBy: '1',
        createdAt: subDays(new Date(), 4),
      }
    ],
    logs: [
      {
        id: '301',
        action: 'تم إنشاء المهمة',
        toStatus: 'new',
        performedBy: '1',
        performedAt: subDays(new Date(), 5),
      },
      {
        id: '302',
        action: 'تم تحويل المهمة إلى قسم التصميم',
        fromStatus: 'new',
        toStatus: 'in_design',
        performedBy: '1',
        performedAt: subDays(new Date(), 3),
      }
    ]
  },
  {
    id: '2',
    title: 'كروت عمل لشركة النور',
    description: 'تصميم وطباعة كروت عمل لموظفي شركة النور بكمية 200 كرت',
    clientName: 'شركة النور للإلكترونيات',
    priority: 'medium',
    status: 'in_management',
    dueDate: subDays(new Date(), -5),
    createdBy: '1',
    createdAt: subDays(new Date(), 10),
    updatedAt: subDays(new Date(), 1),
    assignedTo: '3',
    files: [
      {
        id: '102',
        name: 'شعار الشركة.ai',
        url: '#',
        type: 'image',
        uploadedBy: '1',
        uploadedAt: subDays(new Date(), 10),
      },
      {
        id: '103',
        name: 'تصميم الكروت.pdf',
        url: '#',
        type: 'pdf',
        uploadedBy: '2',
        uploadedAt: subDays(new Date(), 4),
      }
    ],
    comments: [
      {
        id: '202',
        text: 'تم الانتهاء من التصميم، يرجى مراجعته',
        createdBy: '2',
        createdAt: subDays(new Date(), 4),
      }
    ],
    logs: [
      {
        id: '303',
        action: 'تم إنشاء المهمة',
        toStatus: 'new',
        performedBy: '1',
        performedAt: subDays(new Date(), 10),
      },
      {
        id: '304',
        action: 'تم تحويل المهمة إلى قسم التصميم',
        fromStatus: 'new',
        toStatus: 'in_design',
        performedBy: '1',
        performedAt: subDays(new Date(), 8),
      },
      {
        id: '305',
        action: 'تم تحويل المهمة إلى قسم الإدارة',
        fromStatus: 'in_design',
        toStatus: 'in_management',
        performedBy: '2',
        performedAt: subDays(new Date(), 2),
      }
    ]
  },
  {
    id: '3',
    title: 'رول أب لمعرض التقنية',
    description: 'تصميم وطباعة رول أب لمعرض التقنية مقاس 85×200 سم',
    clientName: 'شركة المستقبل للتقنية',
    priority: 'urgent',
    status: 'in_production',
    createdBy: '1',
    createdAt: subDays(new Date(), 15),
    updatedAt: subDays(new Date(), 1),
    assignedTo: '4',
    files: [
      {
        id: '104',
        name: 'محتوى الرول أب.docx',
        url: '#',
        type: 'document',
        uploadedBy: '1',
        uploadedAt: subDays(new Date(), 15),
      },
      {
        id: '105',
        name: 'تصميم الرول أب.pdf',
        url: '#',
        type: 'pdf',
        uploadedBy: '2',
        uploadedAt: subDays(new Date(), 10),
      }
    ],
    comments: [
      {
        id: '203',
        text: 'يجب أن يكون جاهزاً قبل موعد المعرض',
        createdBy: '1',
        createdAt: subDays(new Date(), 14),
      },
      {
        id: '204',
        text: 'تمت الموافقة على التصميم وتحويله للإنتاج',
        createdBy: '3',
        createdAt: subDays(new Date(), 5),
      }
    ],
    logs: [
      {
        id: '306',
        action: 'تم إنشاء المهمة',
        toStatus: 'new',
        performedBy: '1',
        performedAt: subDays(new Date(), 15),
      },
      {
        id: '307',
        action: 'تم تحويل المهمة إلى قسم التصميم',
        fromStatus: 'new',
        toStatus: 'in_design',
        performedBy: '1',
        performedAt: subDays(new Date(), 14),
      },
      {
        id: '308',
        action: 'تم تحويل المهمة إلى قسم الإدارة',
        fromStatus: 'in_design',
        toStatus: 'in_management',
        performedBy: '2',
        performedAt: subDays(new Date(), 8),
      },
      {
        id: '309',
        action: 'تم تحويل المهمة إلى قسم الإنتاج',
        fromStatus: 'in_management',
        toStatus: 'in_production',
        performedBy: '3',
        performedAt: subDays(new Date(), 5),
      }
    ]
  },
  {
    id: '4',
    title: 'بروشور للمنتجات الجديدة',
    description: 'تصميم وطباعة بروشور للمنتجات الجديدة، مقاس A4 مطوي، 1000 نسخة',
    clientName: 'شركة الأفق للتجارة',
    priority: 'low',
    status: 'in_sales',
    createdBy: '1',
    createdAt: subDays(new Date(), 2),
    updatedAt: subDays(new Date(), 2),
    assignedTo: '1',
    files: [
      {
        id: '106',
        name: 'صور المنتجات.zip',
        url: '#',
        type: 'archive',
        uploadedBy: '1',
        uploadedAt: subDays(new Date(), 2),
      }
    ],
    comments: [],
    logs: [
      {
        id: '310',
        action: 'تم إنشاء المهمة',
        toStatus: 'new',
        performedBy: '1',
        performedAt: subDays(new Date(), 2),
      },
      {
        id: '311',
        action: 'تم وضع المهمة في قسم المبيعات',
        fromStatus: 'new',
        toStatus: 'in_sales',
        performedBy: '1',
        performedAt: subDays(new Date(), 2),
      }
    ]
  }
];

// Generate notifications based on task logs
export const generateNotifications = () => {
  let notifications: any[] = [];
  
  tasks.forEach(task => {
    task.logs.slice(-2).forEach(log => {
      notifications.push({
        id: `notif-${log.id}`,
        message: `${log.action} - ${task.title}`,
        taskId: task.id,
        userId: log.performedBy === task.assignedTo ? task.createdBy : task.assignedTo || task.createdBy,
        createdAt: log.performedAt,
        read: false
      });
    });
  });
  
  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const notifications = generateNotifications();

// Get tasks by department
export const getTasksByDepartment = (department: Department) => {
  switch (department) {
    case 'sales':
      return tasks.filter(task => 
        task.status === 'in_sales' || 
        task.status === 'new' || 
        task.createdBy === getUserByDepartment('sales').id
      );
    case 'design':
      return tasks.filter(task => 
        task.status === 'in_design' || 
        task.assignedTo === getUserByDepartment('design').id
      );
    case 'management':
      return tasks.filter(task => 
        task.status === 'in_management' || 
        task.assignedTo === getUserByDepartment('management').id
      );
    case 'production':
      return tasks.filter(task => 
        task.status === 'in_production' || 
        task.assignedTo === getUserByDepartment('production').id
      );
    default:
      return tasks;
  }
};

// Get task status label in Arabic
export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'new': return 'جديدة';
    case 'in_sales': return 'في المبيعات';
    case 'in_design': return 'في التصميم';
    case 'in_management': return 'في الإدارة';
    case 'in_production': return 'في الإنتاج';
    case 'completed': return 'مكتملة';
    default: return 'غير معروف';
  }
};

// Get priority label in Arabic
export const getPriorityLabel = (priority: string): string => {
  switch (priority) {
    case 'low': return 'منخفضة';
    case 'medium': return 'متوسطة';
    case 'high': return 'عالية';
    case 'urgent': return 'عاجلة';
    default: return 'غير معروف';
  }
};

// Get priority color
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'low': return 'bg-blue-100 text-blue-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'urgent': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get status color
export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'new': return 'bg-purple-100 text-purple-800';
    case 'in_sales': return 'bg-indigo-100 text-indigo-800';
    case 'in_design': return 'bg-blue-100 text-blue-800';
    case 'in_management': return 'bg-amber-100 text-amber-800';
    case 'in_production': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get department label in Arabic
export const getDepartmentLabel = (department: Department): string => {
  switch (department) {
    case 'sales': return 'المبيعات';
    case 'design': return 'التصميم';
    case 'management': return 'الإدارة';
    case 'production': return 'الإنتاج';
    default: return 'غير معروف';
  }
};

// Get department color
export const getDepartmentColor = (department: Department): string => {
  switch (department) {
    case 'sales': return 'bg-indigo-600';
    case 'design': return 'bg-blue-600';
    case 'management': return 'bg-amber-600';
    case 'production': return 'bg-green-600';
    default: return 'bg-gray-600';
  }
};

// Get allowed next statuses based on current status and department
export const getAllowedNextStatuses = (currentStatus: TaskStatus, userDepartment: Department): TaskStatus[] => {
  switch (userDepartment) {
    case 'sales':
      if (currentStatus === 'new' || currentStatus === 'in_sales') {
        return ['in_design'];
      }
      return [];
    
    case 'design':
      if (currentStatus === 'in_design') {
        return ['in_management', 'in_sales'];
      }
      return [];
    
    case 'management':
      if (currentStatus === 'in_management') {
        return ['in_production', 'in_design', 'in_sales'];
      }
      return [];
    
    case 'production':
      if (currentStatus === 'in_production') {
        return ['completed'];
      }
      return [];
    
    default:
      return [];
  }
};