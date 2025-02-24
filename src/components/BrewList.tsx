import React, { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BrewListProps {
  onEdit: (brew: any) => void;
}

export default function BrewList({ onEdit }: BrewListProps) {
  const [brews, setBrews] = useState([]);

  useEffect(() => {
    fetchBrews();
  }, []);

  const fetchBrews = async () => {
    const { data, error } = await supabase
      .from('coffee_brews')
      .select(`
        *,
        coffee_beans (
          roaster,
          name
        ),
        brew_ratings (*),
        brew_pours (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching brews:', error);
    } else {
      setBrews(data);
    }
  };

  return (
    <div className="space-y-4">
      {brews.map((brew: any) => (
        <div
          key={brew.id}
          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onEdit(brew)}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {brew.coffee_beans.roaster} - {brew.coffee_beans.name}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(brew.created_at).toLocaleDateString()}
              </p>
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                {brew.water_coffee_ratio && (
                  <p>
                    <span className="font-medium">Ratio:</span> {brew.water_coffee_ratio}
                  </p>
                )}
                {brew.bloom_time && (
                  <p>
                    <span className="font-medium">Bloom:</span> {brew.bloom_time}s
                  </p>
                )}
              </div>
              {brew.brew_ratings && brew.brew_ratings[0] && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Overall Rating:</span>{' '}
                  <span className="text-lg font-semibold text-brown-600">
                    {brew.brew_ratings[0].overall_impression}/10
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(brew);
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Edit2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
      {brews.length === 0 && (
        <p className="text-gray-500 text-center py-4">No brews recorded yet</p>
      )}
    </div>
  );
}