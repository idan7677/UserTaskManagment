import { format } from 'date-fns';
import { Calendar, Clock, Edit, Mail, Phone, Trash2, User } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import taskStore from '../stores/TaskStore';
import Badge from './ui/Badge';
import Button from './ui/Button';

const TaskCard = observer(({ task, onEdit, onDelete }) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'Critical': return 'critical';
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Overdue': return 'danger';
      case 'Due Soon': return 'warning';
      default: return 'primary';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const status = taskStore.getTaskStatus(task);
  const isOverdue = status === 'Overdue';
  const isDueSoon = status === 'Due Soon';

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 hover:shadow-lg transition-shadow ${
      isOverdue ? 'border-l-red-500' : 
      isDueSoon ? 'border-l-yellow-500' : 
      'border-l-blue-500'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {task.description}
            </p>
          </div>
          <div className="flex space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
              className="p-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task)}
              className="p-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={getStatusVariant(status)}>
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
          <Badge variant={getPriorityVariant(task.priority)}>
            {task.priority} Priority
          </Badge>
        </div>

        {/* Due Date */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            Due: {formatDate(task.dueDate)}
          </span>
        </div>

        {/* User Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>{task.fullName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{task.telephone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span>{task.email}</span>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <Badge key={tag.id} variant="default" size="sm">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default TaskCard;