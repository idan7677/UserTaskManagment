import { makeAutoObservable, runInAction } from 'mobx';
import taskService from '../services/taskService';
import { createUserTaskDto, createUpdateUserTaskDto } from '../types';

class TaskStore {
  tasks = [];
  selectedTask = null;
  loading = false;
  error = null;
  filter = {
    priority: '',
    status: '',
    search: ''
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Computed values
  get filteredTasks() {
    return this.tasks.filter(task => {
      const matchesSearch = !this.filter.search || 
        task.title.toLowerCase().includes(this.filter.search.toLowerCase()) ||
        task.description.toLowerCase().includes(this.filter.search.toLowerCase()) ||
        task.fullName.toLowerCase().includes(this.filter.search.toLowerCase());
      
      const matchesPriority = !this.filter.priority || task.priority === this.filter.priority;
      
      const matchesStatus = !this.filter.status || this.getTaskStatus(task) === this.filter.status;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }

  get overdueTasks() {
    return this.tasks.filter(task => new Date(task.dueDate) < new Date() && this.getTaskStatus(task) !== 'Completed');
  }

  get tasksByPriority() {
    const priorities = { Critical: [], High: [], Medium: [], Low: [] };
    this.tasks.forEach(task => {
      if (priorities[task.priority]) {
        priorities[task.priority].push(task);
      }
    });
    return priorities;
  }

  // Actions
  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  setFilter(filterKey, value) {
    this.filter[filterKey] = value;
  }

  clearFilters() {
    this.filter = {
      priority: '',
      status: '',
      search: ''
    };
  }

  setSelectedTask(task) {
    this.selectedTask = task;
  }

  getTaskStatus(task) {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    if (task.isCompleted) return 'Completed';
    if (dueDate < now) return 'Overdue';
    if (dueDate.getTime() - now.getTime() <= 24 * 60 * 60 * 1000) return 'Due Soon';
    return 'Pending';
  }

  async loadTasks() {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const tasks = await taskService.getAllTasks();
      runInAction(() => {
        this.tasks = tasks;
      });
    } catch (error) {
      runInAction(() => {
        this.setError(error.message);
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async createTask(taskData) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const dto = createUserTaskDto(taskData);
      const newTask = await taskService.createTask(dto);
      runInAction(() => {
        this.tasks.push(newTask);
      });
      return newTask;
    } catch (error) {
      runInAction(() => {
        this.setError(error.message);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async updateTask(id, taskData) {
    console.log('TaskStore.updateTask called with id:', id, 'taskData:', taskData);
    this.setLoading(true);
    this.setError(null);
    
    try {
      const dto = createUpdateUserTaskDto(taskData);
      console.log('DTO created:', dto);
      const updatedTask = await taskService.updateTask(id, dto);
      runInAction(() => {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        if (this.selectedTask && this.selectedTask.id === id) {
          this.selectedTask = updatedTask;
        }
      });
      return updatedTask;
    } catch (error) {
      runInAction(() => {
        this.setError(error.message);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async deleteTask(id) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      await taskService.deleteTask(id);
      runInAction(() => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        if (this.selectedTask && this.selectedTask.id === id) {
          this.selectedTask = null;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.setError(error.message);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  async loadTasksWithMultipleTags() {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const tasks = await taskService.getTasksWithMultipleTags();
      return tasks;
    } catch (error) {
      runInAction(() => {
        this.setError(error.message);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }
}

const taskStore = new TaskStore();
export default taskStore;