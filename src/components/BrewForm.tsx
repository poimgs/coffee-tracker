import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BrewFormProps {
  onClose: (success?: boolean) => void;
  brew?: any;
}

interface Pour {
  amount: number;
  notes: string;
}

interface BrewFormData {
  coffeeBean: string;
  waterCoffeeRatio: string;
  bloomTime: number;
  pours: Pour[];
  ratings: {
    overall_impression: { rating: number; notes: string };
    aroma: { rating: number | null; notes: string };
    flavor: { rating: number | null; notes: string };
    acidity: { rating: number | null; notes: string };
    body: { rating: number | null; notes: string };
    sweetness: { rating: number | null; notes: string };
    bitterness: { rating: number | null; notes: string };
    aftertaste: { rating: number | null; notes: string };
    balance: { rating: number | null; notes: string };
  };
}

export default function BrewForm({ onClose, brew }: BrewFormProps) {
  const [coffeeBeans, setCoffeeBeans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pourCount, setPourCount] = useState(brew?.brew_pours?.length || 1);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<BrewFormData>({
    defaultValues: brew ? {
      coffeeBean: brew.coffee_bean_id,
      waterCoffeeRatio: brew.water_coffee_ratio,
      bloomTime: brew.bloom_time,
      pours: brew.brew_pours,
      ratings: brew.brew_ratings?.[0] ? {
        overall_impression: { rating: brew.brew_ratings[0].overall_impression, notes: brew.brew_ratings[0].overall_notes || '' },
        aroma: { rating: brew.brew_ratings[0].aroma || null, notes: brew.brew_ratings[0].aroma_notes || '' },
        flavor: { rating: brew.brew_ratings[0].flavor || null, notes: brew.brew_ratings[0].flavor_notes || '' },
        acidity: { rating: brew.brew_ratings[0].acidity || null, notes: brew.brew_ratings[0].acidity_notes || '' },
        body: { rating: brew.brew_ratings[0].body || null, notes: brew.brew_ratings[0].body_notes || '' },
        sweetness: { rating: brew.brew_ratings[0].sweetness || null, notes: brew.brew_ratings[0].sweetness_notes || '' },
        bitterness: { rating: brew.brew_ratings[0].bitterness || null, notes: brew.brew_ratings[0].bitterness_notes || '' },
        aftertaste: { rating: brew.brew_ratings[0].aftertaste || null, notes: brew.brew_ratings[0].aftertaste_notes || '' },
        balance: { rating: brew.brew_ratings[0].balance || null, notes: brew.brew_ratings[0].balance_notes || '' }
      } : {
        overall_impression: { rating: 0, notes: '' },
        aroma: { rating: null, notes: '' },
        flavor: { rating: null, notes: '' },
        acidity: { rating: null, notes: '' },
        body: { rating: null, notes: '' },
        sweetness: { rating: null, notes: '' },
        bitterness: { rating: null, notes: '' },
        aftertaste: { rating: null, notes: '' },
        balance: { rating: null, notes: '' }
      }
    } : {
      coffeeBean: '',
      waterCoffeeRatio: '',
      bloomTime: 0,
      pours: [],
      ratings: {
        overall_impression: { rating: 0, notes: '' },
        aroma: { rating: null, notes: '' },
        flavor: { rating: null, notes: '' },
        acidity: { rating: null, notes: '' },
        body: { rating: null, notes: '' },
        sweetness: { rating: null, notes: '' },
        bitterness: { rating: null, notes: '' },
        aftertaste: { rating: null, notes: '' },
        balance: { rating: null, notes: '' }
      }
    }
  });

  useEffect(() => {
    const fetchCoffeeBeans = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('coffee_beans')
          .select('id, roaster, name')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setCoffeeBeans(data || []);
        
        // If we're editing and have a coffee_bean_id, ensure it's set
        if (brew?.coffee_bean_id) {
          setValue('coffeeBean', brew.coffee_bean_id);
        }
      } catch (error) {
        console.error('Error fetching coffee beans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoffeeBeans();
  }, [brew, setValue]);

  const onSubmit = async (data: BrewFormData) => {
    try {
      // Prepare ratings data with null for empty values
      const ratingsData = {
        overall_impression: data.ratings.overall_impression.rating,
        overall_notes: data.ratings.overall_impression.notes,
        aroma: data.ratings.aroma.rating || null,
        aroma_notes: data.ratings.aroma.notes,
        flavor: data.ratings.flavor.rating || null,
        flavor_notes: data.ratings.flavor.notes,
        acidity: data.ratings.acidity.rating || null,
        acidity_notes: data.ratings.acidity.notes,
        body: data.ratings.body.rating || null,
        body_notes: data.ratings.body.notes,
        sweetness: data.ratings.sweetness.rating || null,
        sweetness_notes: data.ratings.sweetness.notes,
        bitterness: data.ratings.bitterness.rating || null,
        bitterness_notes: data.ratings.bitterness.notes,
        aftertaste: data.ratings.aftertaste.rating || null,
        aftertaste_notes: data.ratings.aftertaste.notes,
        balance: data.ratings.balance.rating || null,
        balance_notes: data.ratings.balance.notes
      };

      if (brew) {
        // Update existing brew
        const { error: brewError } = await supabase
          .from('coffee_brews')
          .update({
            coffee_bean_id: data.coffeeBean,
            water_coffee_ratio: data.waterCoffeeRatio || null,
            bloom_time: data.bloomTime || null
          })
          .eq('id', brew.id);

        if (brewError) throw brewError;

        // Update ratings
        const { error: ratingsError } = await supabase
          .from('brew_ratings')
          .update(ratingsData)
          .eq('brew_id', brew.id);

        if (ratingsError) throw ratingsError;

      } else {
        // Insert new brew
        const { data: brewData, error: brewError } = await supabase
          .from('coffee_brews')
          .insert([{
            coffee_bean_id: data.coffeeBean,
            water_coffee_ratio: data.waterCoffeeRatio || null,
            bloom_time: data.bloomTime || null,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single();

        if (brewError) throw brewError;

        // Insert pours
        const pours = Array.from({ length: pourCount }, (_, i) => ({
          amount: data.pours[i]?.amount || 0,
          notes: data.pours[i]?.notes || '',
          pour_order: i + 1
        }));

        const { error: poursError } = await supabase
          .from('brew_pours')
          .insert(
            pours.map(pour => ({
              brew_id: brewData.id,
              ...pour
            }))
          );

        if (poursError) throw poursError;

        // Insert ratings
        const { error: ratingsError } = await supabase
          .from('brew_ratings')
          .insert([{
            brew_id: brewData.id,
            ...ratingsData
          }]);

        if (ratingsError) throw ratingsError;
      }

      onClose(true);
    } catch (error) {
      console.error('Error saving brew:', error);
      onClose(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl m-4 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{brew ? 'Edit Brew' : 'Add New Brew'}</h2>
          <button onClick={() => onClose(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Brew Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coffee Bean <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('coffeeBean', { required: "Coffee bean is required" })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                >
                  <option value="">Select a coffee</option>
                  {coffeeBeans.map((bean: any) => (
                    <option key={bean.id} value={bean.id}>
                      {bean.roaster} - {bean.name}
                    </option>
                  ))}
                </select>
                {errors.coffeeBean && (
                  <span className="text-red-500 text-sm">{errors.coffeeBean.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Water to Coffee Ratio</label>
                <input
                  type="text"
                  {...register('waterCoffeeRatio')}
                  placeholder="e.g., 16:1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bloom Time (seconds)</label>
                <input
                  type="number"
                  {...register('bloomTime')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                />
              </div>
            </div>

            {/* Pours */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Pours</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPourCount(Math.max(1, pourCount - 1))}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600">{pourCount}</span>
                  <button
                    type="button"
                    onClick={() => setPourCount(pourCount + 1)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: pourCount }).map((_, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="w-8 text-sm text-gray-500">#{index + 1}</div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        {...register(`pours.${index}.amount` as any)}
                        placeholder="Amount (ml)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                      />
                      <input
                        type="text"
                        {...register(`pours.${index}.notes` as any)}
                        placeholder="Notes"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coffee Quality Ratings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Coffee Quality</h3>
              <div className="space-y-3">
                {/* Overall Impression (Required) */}
                <div className="grid grid-cols-12 gap-4 items-center py-2 border-b border-gray-100 bg-gray-50">
                  <label className="col-span-2 text-sm font-medium text-gray-700">
                    Overall Impression <span className="text-red-500">*</span>
                  </label>
                  <div className="col-span-2">
                    <input
                      type="number"
                      {...register('ratings.overall_impression.rating', {
                        required: "Rating is required",
                        min: { value: 1, message: "Minimum rating is 1" },
                        max: { value: 10, message: "Maximum rating is 10" }
                      })}
                      min="1"
                      max="10"
                      placeholder="1-10"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                    />
                    {errors.ratings?.overall_impression?.rating && (
                      <span className="text-red-500 text-sm">
                        {errors.ratings.overall_impression.rating.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      {...register('ratings.overall_impression.notes')}
                      placeholder="Notes"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                    />
                  </div>
                </div>

                {/* Other Ratings (Optional) */}
                {[
                  { key: 'aroma', label: 'Aroma' },
                  { key: 'flavor', label: 'Flavor' },
                  { key: 'acidity', label: 'Acidity' },
                  { key: 'body', label: 'Body' },
                  { key: 'sweetness', label: 'Sweetness' },
                  { key: 'bitterness', label: 'Bitterness' },
                  { key: 'aftertaste', label: 'Aftertaste' },
                  { key: 'balance', label: 'Balance' }
                ].map(({ key, label }) => (
                  <div key={key} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-gray-100">
                    <label className="col-span-2 text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <div className="col-span-2">
                      <input
                        type="number"
                        {...register(`ratings.${key}.rating` as any, {
                          min: { value: 1, message: "Minimum rating is 1" },
                          max: { value: 10, message: "Maximum rating is 10" }
                        })}
                        min="1"
                        max="10"
                        placeholder="1-10"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                      />
                    </div>
                    <div className="col-span-8">
                      <input
                        type="text"
                        {...register(`ratings.${key}.notes` as any)}
                        placeholder="Notes"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="border-t p-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 text-sm font-medium text-white bg-brown-600 rounded-md hover:bg-brown-700"
          >
            {brew ? 'Save Changes' : 'Add Brew'}
          </button>
        </div>
      </div>
    </div>
  );
}