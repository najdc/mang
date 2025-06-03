import { create } from 'zustand';
import { Notification } from '../types';
import { db } from '../lib/firebase';
import { 
  collection,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  fetchNotifications: (userId: string) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  fetchNotifications: (userId: string) => {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Notification[];
        
        set({ 
          notifications,
          unreadCount: notifications.filter(n => !n.read).length
        });
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },
  
  markAsRead: async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },
  
  markAllAsRead: async () => {
    try {
      const { notifications } = get();
      const unreadNotifications = notifications.filter(n => !n.read);
      
      await Promise.all(
        unreadNotifications.map(notification =>
          updateDoc(doc(db, 'notifications', notification.id), {
            read: true
          })
        )
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }
}));