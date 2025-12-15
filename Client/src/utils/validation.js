import * as yup from 'yup';
import { TaskPriority, isValidEmail, isValidPhone } from '../types';

// Task validation schema
export const taskValidationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  
  // dueDate: yup
  //   .date()
  //   .required('Due date is required')
  //   .min(new Date(), 'Due date must be in the future'),
  
  // priority: yup
  //   .string()
  //   .required('Priority is required')
  //   .oneOf(Object.values(TaskPriority), 'Invalid priority selected'),
  
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
    .trim(),
  
  telephone: yup
    .string()
    .required('Telephone is required')
    .test('phone-validation', 'Invalid phone number format', function(value) {
      return value ? isValidPhone(value) : false;
    }),
  
  email: yup
    .string()
    .required('Email is required')
    .test('email-validation', 'Invalid email format', function(value) {
      return value ? isValidEmail(value) : false;
    })
    .max(100, 'Email must not exceed 100 characters'),
  
  tags: yup
    .array()
    .of(yup.number().positive('Invalid tag ID'))
    .min(1, 'At least one tag must be selected')
    .max(10, 'Maximum 10 tags allowed')
});

// Tag validation schema
export const tagValidationSchema = yup.object({
  name: yup
    .string()
    .required('Tag name is required')
    .max(20, 'Tag name must not exceed 20 characters')
    .trim()
});

// Form field validation helpers
export const validateField = (schema, field, value) => {
  try {
    schema.validateSyncAt(field, { [field]: value });
    return null;
  } catch (error) {
    return error.message;
  }
};

export const validateForm = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach(err => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};