import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { tagValidationSchema } from '../../utils/validation';

const TagForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(tagValidationSchema),
    defaultValues: {
      name: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || ''
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Tag Name */}
      <Input
        label="Tag Name"
        required
        {...register('name')}
        error={errors.name?.message}
        placeholder="Enter tag name"
        autoFocus
      />

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
          {initialData ? 'Update Tag' : 'Create Tag'}
        </Button>
      </div>
    </form>
  );
};

export default TagForm;