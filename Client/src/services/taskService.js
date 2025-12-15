import apiClient from './apiClient';

class TaskService {
  async getAllTasks() {
    const response = await apiClient.get('/usertasks');
    return response.data;
  }

  async getTaskById(id) {
    const response = await apiClient.get(`/usertasks/${id}`);
    return response.data;
  }

  async createTask(taskData) {
    const response = await apiClient.post('/usertasks', taskData);
    return response.data;
  }

  async updateTask(id, taskData) {
    const response = await apiClient.put(`/usertasks/${id}`, taskData);
    return response.data;
  }

  async deleteTask(id) {
    await apiClient.delete(`/usertasks/${id}`);
    return true;
  }

  async getTasksWithMultipleTags() {
    const response = await apiClient.get('/usertasks/with-multiple-tags');
    return response.data;
  }
}

const taskService = new TaskService();
export default taskService;