import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { format } from 'date-fns';
import Badge from '../ui/Badge';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  if (!user) return null;
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button className="p-1 rounded-md text-gray-400 md:hidden">
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-medium text-gray-700 mr-4">نظام إدارة مهام المطبعة</h1>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 left-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">الإشعارات</h3>
                  <button 
                    onClick={() => markAllAsRead()}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    تعيين الكل كمقروءة
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      لا توجد إشعارات
                    </div>
                  ) : (
                    <div>
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-indigo-50' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <Badge variant="default" className="mr-2">
                                جديد
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(notification.createdAt, 'yyyy/MM/dd HH:mm')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-2 border-t border-gray-200 text-center">
                  <button 
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;