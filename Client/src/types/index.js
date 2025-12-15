// Priority enum
export const TaskPriority = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

// Task status for UI state management
export const TaskStatus = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue'
};

// API Response types
export const createUserTaskDto = (data) => ({
  title: data.title,
  description: data.description,
  dueDate: data.dueDate,
  priority: data.priority,
  fullName: data.fullName,
  telephone: data.telephone,
  email: data.email,
  tagIds: data.tagIds || []
});

export const createUpdateUserTaskDto = (data) => ({
  title: data.title,
  description: data.description,
  dueDate: data.dueDate,
  priority: data.priority,
  fullName: data.fullName,
  telephone: data.telephone,
  email: data.email,
  tagIds: data.tagIds || []
});

export const createTagDto = (name) => ({
  name
});

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/[\s\-().]/g, '');
  // Allow international format with + and 7-15 digits total
  const phoneRegex = /^(?:\+972|0)(?:[23489]|5\d|7\d)\d{7}$/;
  return phoneRegex.test(cleanPhone);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const parseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};