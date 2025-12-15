import { makeAutoObservable, runInAction } from 'mobx';
import tagService from '../services/tagService';
import { createTagDto } from '../types';

class TagStore {
  tags = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Computed values
  get tagOptions() {
    return this.tags.map(tag => ({
      value: tag.id,
      label: tag.name
    }));
  }

  // Actions
  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  async loadTags() {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const tags = await tagService.getAllTags();
      runInAction(() => {
        this.tags = tags;
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

  async createTag(name) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const dto = createTagDto(name);
      const newTag = await tagService.createTag(dto);
      runInAction(() => {
        this.tags.push(newTag);
      });
      return newTag;
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

  async updateTag(id, name) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const dto = createTagDto(name);
      const updatedTag = await tagService.updateTag(id, dto);
      runInAction(() => {
        const index = this.tags.findIndex(tag => tag.id === id);
        if (index !== -1) {
          this.tags[index] = updatedTag;
        }
      });
      return updatedTag;
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

  async deleteTag(id) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      await tagService.deleteTag(id);
      runInAction(() => {
        this.tags = this.tags.filter(tag => tag.id !== id);
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

  getTagById(id) {
    return this.tags.find(tag => tag.id === id);
  }

  getTagsByIds(ids) {
    return this.tags.filter(tag => ids.includes(tag.id));
  }
}

const tagStore = new TagStore();
export default tagStore;