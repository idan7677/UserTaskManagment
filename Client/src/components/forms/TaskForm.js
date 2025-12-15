import { yupResolver } from '@hookform/resolvers/yup';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import tagStore from '../../stores/TagStore';
import { TaskPriority, formatDate } from '../../types';
import { taskValidationSchema } from '../../utils/validation';
import Button from '../ui/Button';
import Input from '../ui/Input';

const TaskForm = observer(({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(taskValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: '',
      fullName: '',
      telephone: '',
      email: '',
      tags: []
    }
  });

  const priorityOptions = Object.values(TaskPriority).map(priority => ({
    value: priority,
    label: priority
  }));

  useEffect(() => {
    tagStore.loadTags();
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : new Date(),
        priority: initialData.priority || '',
        fullName: initialData.fullName || '',
        telephone: initialData.telephone || '',
        email: initialData.email || '',
        tagIds: initialData.tags || []
      });

      if (initialData.tags) {
        const tags = tagStore.getTagsByIds([...initialData.tags].map(tag => tag.id));
        setSelectedTags(tags.map(tag => ({ value: tag.id, label: tag.name })));
      }
    }
  }, [initialData, reset]);

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
    const tagIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setValue('tagIds', tagIds);
  };

  const onFormSubmit = (data) => {
    const formattedData = {
      ...data,
      dueDate: formatDate(data.dueDate),
      tagIds: selectedTags.map(tag => tag.value)
    };
    onSubmit(formattedData);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: errors.tagIds ? '#ef4444' : '#d1d5db',
      '&:hover': {
        borderColor: errors.tagIds ? '#ef4444' : '#9ca3af'
      },
      boxShadow: state.isFocused 
        ? errors.tagIds 
          ? '0 0 0 1px #ef4444' 
          : '0 0 0 1px #3b82f6'
        : provided.boxShadow
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#3730a3'
    }),
    menuList: (base) => ({
        ...base,
        maxHeight: 100,    
        overflowY: "auto",
      }),
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <Input
            label="Title"
            required
            {...register('title')}
            error={errors.title?.message}
            placeholder="Enter task title"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter task description"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                value={field.value ? formatDate(field.value) : ''}
                onChange={(e) => field.onChange(new Date(e.target.value))}
                min={formatDate(new Date())}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-600 mt-1">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            {...register('priority')}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.priority ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select priority</option>
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>
          )}
        </div>

        {/* User Full Name */}
        <div>
          <Input
            label="Full Name"
            required
            {...register('fullName')}
            error={errors.fullName?.message}
            placeholder="Enter full name"
          />
        </div>

        {/* User Telephone */}
        <div>
          <Input
            label="Telephone"
            required
            type="tel"
            {...register('telephone')}
            error={errors.telephone?.message}
            placeholder="Enter phone number"
          />
        </div>

        {/* User Email */}
        <div className="md:col-span-2">
          <Input
            label="Email"
            required
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="Enter email address"
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-red-500">*</span>
          </label>
          <Select
            isMulti
            value={selectedTags}
            onChange={handleTagChange}
            options={tagStore.tagOptions}
            styles={customSelectStyles}
            placeholder="Select tags..."
            className="react-select-container"
            classNamePrefix="react-select"
            isLoading={tagStore.loading}
            noOptionsMessage={() => "No tags available"}
          />
          {errors.tagIds && (
            <p className="text-sm text-red-600 mt-1">{errors.tagIds.message}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
});

export default TaskForm;