import apiClient from './apiClient';

class TagService {
  async getAllTags() {
    const response = await apiClient.get('/tags');
    return response.data;
  }

  async getTagById(id) {
    const response = await apiClient.get(`/tags/${id}`);
    return response.data;
  }

  async createTag(tagData) {
    const response = await apiClient.post('/tags', tagData);
    return response.data;
  }

  async updateTag(id, tagData) {
    const response = await apiClient.put(`/tags/${id}`, tagData);
    return response.data;
  }

  async deleteTag(id) {
    await apiClient.delete(`/tags/${id}`);
    return true;
  }
}

const tagService = new TagService();
export default tagService;