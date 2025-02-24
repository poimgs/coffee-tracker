import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CoffeeBeansFormProps {
  onClose: (success?: boolean) => void;
  bean?: any;
}

interface CoffeeBeansFormData {
  roaster: string;
  name: string;
  tastingNotes: string;
  process: string;
}

export default function CoffeeBeansForm({ onClose, bean }: CoffeeBeansFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CoffeeBeansFormData>({
    defaultValues: bean ? {
      roaster: bean.roaster,
      name: bean.name,
      tastingNotes: bean.tasting_notes,
      process: bean.process
    } : undefined
  });

  const onSubmit = async (data: CoffeeBeansFormData) => {
    try {
      if (bean) {
        const { error } = await supabase
          .from('coffee_beans')
          .update({
            roaster: data.roaster,
            name: data.name,
            tasting_notes: data.tastingNotes,
            process: data.process
          })
          .eq('id', bean.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('coffee_beans')
          .insert([{
            roaster: data.roaster,
            name: data.name,
            tasting_notes: data.tastingNotes,
            process: data.process,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }]);

        if (error) throw error;
      }
      onClose(true);
    } catch (error) {
      console.error('Error saving coffee beans:', error);
      onClose(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {bean ? 'Edit Coffee Beans' : 'Add New Coffee Beans'}
          </h2>
          <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Roaster</label>
            <input
              type="text"
              {...register('roaster', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
            />
            {errors.roaster && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Coffee Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
            />
            {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tasting Notes</label>
            <textarea
              {...register('tastingNotes')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Process</label>
            <input
              type="text"
              {...register('process', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
            />
            {errors.process && <span className="text-red-500 text-sm">This field is required</span>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brown-600 rounded-md hover:bg-brown-700"
            >
              {bean ? 'Save Changes' : 'Add Coffee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}