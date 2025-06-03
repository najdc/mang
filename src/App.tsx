import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useNotificationStore } from './store/notificationStore';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();
  
  // Fetch notifications when authenticated user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications(user.id);
    }
  }, [isAuthenticated, user, fetchNotifications]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard\" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          
          {/* Placeholder routes */}
          <Route path="users" element={<div className="p-8 text-center">صفحة المستخدمين - قيد التطوير</div>} />
          <Route path="reports" element={<div className="p-8 text-center">صفحة التقارير - قيد التطوير</div>} />
          <Route path="settings" element={<div className="p-8 text-center">صفحة الإعدادات - قيد التطوير</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;