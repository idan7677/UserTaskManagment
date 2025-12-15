import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Search, Plus, Edit, Trash2, Tag } from 'lucide-react';

import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import Modal from './ui/Modal';
import TagForm from './forms/TagForm';
import tagStore from '../stores/TagStore';

const TagList = observer(() => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTags = tagStore.tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTag = async (tagData) => {
    try {
      await tagStore.createTag(tagData.name);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setShowEditModal(true);
  };

  const handleUpdateTag = async (tagData) => {
    try {
      await tagStore.updateTag(selectedTag.id, tagData.name);
      setShowEditModal(false);
      setSelectedTag(null);
    } catch (error) {
      console.error('Failed to update tag:', error);
    }
  };

  const handleDeleteClick = (tag) => {
    setTagToDelete(tag);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await tagStore.deleteTag(tagToDelete.id);
      setShowDeleteConfirm(false);
      setTagToDelete(null);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (tagStore.loading && tagStore.tags.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tag Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredTags.length} of {tagStore.tags.length} tags
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Tag
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Error Message */}
      {tagStore.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{tagStore.error}</p>
        </div>
      )}

      {/* Tags Grid */}
      {filteredTags.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Tag className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
          <p className="text-gray-600 mb-4">
            {tagStore.tags.length === 0 
              ? "Get started by creating your first tag."
              : "Try adjusting your search terms."
            }
          </p>
          {tagStore.tags.length === 0 && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Tag
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Tags</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredTags.map((tag) => (
              <div key={tag.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Tag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{tag.name}</h4>
                      <p className="text-xs text-gray-500">ID: {tag.id}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTag(tag)}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(tag)}
                      className="p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Tag Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Tag"
        size="sm"
      >
        <TagForm
          onSubmit={handleCreateTag}
          onCancel={() => setShowCreateModal(false)}
          loading={tagStore.loading}
        />
      </Modal>

      {/* Edit Tag Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTag(null);
        }}
        title="Edit Tag"
        size="sm"
      >
        <TagForm
          initialData={selectedTag}
          onSubmit={handleUpdateTag}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedTag(null);
          }}
          loading={tagStore.loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setTagToDelete(null);
        }}
        title="Delete Tag"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{tagToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setTagToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={tagStore.loading}
            >
              Delete Tag
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default TagList;