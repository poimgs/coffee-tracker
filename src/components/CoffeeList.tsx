import React, { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CoffeeListProps {
  onEdit: (bean: any) => void;
}

export default function CoffeeList({ onEdit }: CoffeeListProps) {
  const [coffees, setCoffees] = useState([]);

  useEffect(() => {
    fetchCoffees();
  }, []);

  const fetchCoffees = async () => {
    const { data, error } = await supabase
      .from('coffee_beans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coffees:', error);
    } else {
      setCoffees(data);
    }
  };

  return (
    <div className="space-y-4">
      {coffees.map((coffee: any) => (
        <div 
          key={coffee.id} 
          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onEdit(coffee)}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{coffee.name}</h3>
              <p className="text-sm text-gray-500">by {coffee.roaster}</p>
              {coffee.tasting_notes && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Tasting Notes:</span> {coffee.tasting_notes}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium">Process:</span> {coffee.process}
              </p>
            </div>
            <button
              onClick={() => onEdit(coffee)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Edit2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
      {coffees.length === 0 && (
        <p className="text-gray-500 text-center py-4">No coffees added yet</p>
      )}
    </div>
  );
}