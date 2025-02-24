import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import BrewList from '../components/BrewList';
import BrewForm from '../components/BrewForm';
import Toast from '../components/Toast';

export default function BrewsPage() {
  const [showBrewForm, setShowBrewForm] = useState(false);
  const [editingBrew, setEditingBrew] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [listKey, setListKey] = useState(0);

  const handleFormClose = (success = false) => {
    setShowBrewForm(false);
    setEditingBrew(null);
    if (success) {
      setShowToast(true);
      setListKey(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Brews</h2>
        <button
          onClick={() => {
            setEditingBrew(null);
            setShowBrewForm(true);
          }}
          className="flex items-center text-sm bg-brown-600 text-white px-3 py-2 rounded-md hover:bg-brown-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Brew
        </button>
      </div>
      <BrewList 
        key={listKey}
        onEdit={(brew) => {
          setEditingBrew(brew);
          setShowBrewForm(true);
        }} 
      />
      {showBrewForm && (
        <BrewForm
          brew={editingBrew}
          onClose={handleFormClose}
        />
      )}
      {showToast && (
        <Toast 
          message={`Brew ${editingBrew ? 'updated' : 'added'} successfully!`}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}