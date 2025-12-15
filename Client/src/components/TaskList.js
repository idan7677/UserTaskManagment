import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Search, Filter, Plus } from 'lucide-react';

import TaskCard from './TaskCard';
import Button from './ui/Button';

import Select from './ui/Select';
import LoadingSpinner from './ui/LoadingSpinner';
import Modal from './ui/Modal';
import TaskForm from './forms/TaskForm';
import { TaskPriority, TaskStatus } from '../types';
import taskStore from '../stores/TaskStore';

const TaskList = observer(() => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    ...Object.values(TaskPriority).map(priority => ({
      value: priority,
      label: priority
    }))
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.values(TaskStatus).map(status => ({
      value: status,
      label: status
    }))
  ];

  const handleCreateTask = async (taskData) => {
    try {
      await taskStore.createTask(taskData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = async (taskData) => {
    console.log('handleUpdateTask called with:', taskData);
    console.log('selectedTask.id:', selectedTask?.id);
    try {
      await taskStore.updateTask(selectedTask.id, taskData);
      setShowEditModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await taskStore.deleteTask(taskToDelete.id);
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleSearchChange = (e) => {
    taskStore.setFilter('search', e.target.value);
  };

  const handlePriorityFilter = (e) => {
    taskStore.setFilter('priority', e.target.value);
  };

  const handleStatusFilter = (e) => {
    taskStore.setFilter('status', e.target.value);
  };

  const clearFilters = () => {
    taskStore.clearFilters();
  };

  if (taskStore.loading && taskStore.tasks.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">
            {taskStore.filteredTasks.length} of {taskStore.tasks.length} tasks
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={taskStore.filter.search}
                onChange={handleSearchChange}
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <Select
            options={priorityOptions}
            value={taskStore.filter.priority}
            onChange={handlePriorityFilter}
            placeholder="Filter by priority"
          />
          <Select
            options={statusOptions}
            value={taskStore.filter.status}
            onChange={handleStatusFilter}
            placeholder="Filter by status"
          />
        </div>
        
        {(taskStore.filter.search || taskStore.filter.priority || taskStore.filter.status) && (
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Filters applied
            </span>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {taskStore.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{taskStore.error}</p>
        </div>
      )}

      {/* Task Grid */}
      {taskStore.filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-4">
            {taskStore.tasks.length === 0 
              ? "Get started by creating your first task."
              : "Try adjusting your filters or search terms."
            }
          </p>
          {taskStore.tasks.length === 0 && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taskStore.filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateModal(false)}
          loading={taskStore.loading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
        size="lg"
      >
        <TaskForm
          initialData={selectedTask}
          onSubmit={handleUpdateTask}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          loading={taskStore.loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setTaskToDelete(null);
        }}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setTaskToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={taskStore.loading}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default TaskList;