import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CoffeeList from '../components/CoffeeList';
import CoffeeBeansForm from '../components/CoffeeBeansForm';
import Toast from '../components/Toast';

export default function BeansPage() {
  const [showCoffeeForm, setShowCoffeeForm] = useState(false);
  const [editingBean, setEditingBean] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [listKey, setListKey] = useState(0);

  const handleFormClose = (success = false) => {
    setShowCoffeeForm(false);
    setEditingBean(null);
    if (success) {
      setShowToast(true);
      setListKey(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Coffee Beans</h2>
        <button
          onClick={() => {
            setEditingBean(null);
            setShowCoffeeForm(true);
          }}
          className="flex items-center text-sm bg-brown-600 text-white px-3 py-2 rounded-md hover:bg-brown-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Coffee
        </button>
      </div>
      <CoffeeList 
        key={listKey}
        onEdit={(bean) => {
          setEditingBean(bean);
          setShowCoffeeForm(true);
        }} 
      />
      {showCoffeeForm && (
        <CoffeeBeansForm
          bean={editingBean}
          onClose={handleFormClose}
        />
      )}
      {showToast && (
        <Toast 
          message={`Coffee bean ${editingBean ? 'updated' : 'added'} successfully!`}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}