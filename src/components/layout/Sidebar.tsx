import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Settings,
  BarChart,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getDepartmentLabel, getDepartmentColor } from '../../mocks/data';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  if (!user) return null;
  
  const navItems = [
    {
      name: 'لوحة التحكم',
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      name: 'المهام',
      href: '/tasks',
      icon: <ClipboardCheck size={20} />
    },
    {
      name: 'المستخدمين',
      href: '/users',
      icon: <Users size={20} />
    },
    {
      name: 'التقارير',
      href: '/reports',
      icon: <BarChart size={20} />
    },
    {
      name: 'الإعدادات',
      href: '/settings',
      icon: <Settings size={20} />
    }
  ];
  
  return (
    <div className="w-64 bg-white shadow-md z-10">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">مطبعة الريادة</h2>
          <div className="mt-4 flex items-center space-x-2 space-x-reverse">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <div className="flex items-center mt-1">
                <span 
                  className={`inline-block h-2 w-2 rounded-full mr-1 ${getDepartmentColor(user.department)}`} 
                />
                <span className="text-xs text-gray-500">
                  {getDepartmentLabel(user.department)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  location.pathname === item.href
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="ml-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogOut size={20} className="ml-3" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;