import { create } from 'zustand';
import { Task, TaskStatus, TaskFile, TaskComment, TaskLog } from '../types';
import { db, storage } from '../lib/firebase';
import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  
  fetchTasks: () => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'files' | 'comments' | 'logs'>) => Promise<Task>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus, comment?: string) => Promise<void>;
  addTaskComment: (taskId: string, text: string, userId: string) => Promise<void>;
  addTaskFile: (taskId: string, file: File) => Promise<void>;
  
  setSelectedTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  
  fetchTasks: async () => {
    set({ isLoading: true });
    
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        orderBy('createdAt', 'desc')
      );
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Task[];
        
        set({ tasks, isLoading: false });
      });
      
      // Clean up listener on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ isLoading: false });
    }
  },
  
  getTaskById: (id: string) => {
    return get().tasks.find(task => task.id === id);
  },
  
  createTask: async (taskData) => {
    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        files: [],
        comments: [],
        logs: [{
          id: `log-${Date.now()}`,
          action: 'تم إنشاء المهمة',
          toStatus: taskData.status,
          performedBy: taskData.createdBy,
          performedAt: new Date(),
        }]
      });
      
      const newTask = {
        id: taskRef.id,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
        files: [],
        comments: [],
        logs: [{
          id: `log-${Date.now()}`,
          action: 'تم إنشاء المهمة',
          toStatus: taskData.status,
          performedBy: taskData.createdBy,
          performedAt: new Date(),
        }]
      };
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId: string, newStatus: TaskStatus, comment?: string) => {
    try {
      const task = get().tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newLog = {
        id: `log-${Date.now()}`,
        action: 'تم تغيير حالة المهمة',
        fromStatus: task.status,
        toStatus: newStatus,
        performedBy: task.assignedTo || task.createdBy,
        performedAt: new Date(),
        comment
      };
      
      await updateDoc(doc(db, 'tasks', taskId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        logs: [...task.logs, newLog]
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },
  
  addTaskComment: async (taskId: string, text: string, userId: string) => {
    try {
      const task = get().tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newComment: TaskComment = {
        id: `comment-${Date.now()}`,
        text,
        createdBy: userId,
        createdAt: new Date(),
      };
      
      await updateDoc(doc(db, 'tasks', taskId), {
        comments: [...task.comments, newComment],
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
  
  addTaskFile: async (taskId: string, file: File) => {
    try {
      const task = get().tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `tasks/${taskId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const newFile: TaskFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        url: downloadURL,
        type: file.type,
        uploadedBy: task.assignedTo || task.createdBy,
        uploadedAt: new Date(),
      };
      
      await updateDoc(doc(db, 'tasks', taskId), {
        files: [...task.files, newFile],
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding file:', error);
      throw error;
    }
  },
  
  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },
}));