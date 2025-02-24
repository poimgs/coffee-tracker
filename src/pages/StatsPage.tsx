import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalBrews: number;
  averageRating: number;
  topCoffees: Array<{
    name: string;
    roaster: string;
    average_rating: number;
    brew_count: number;
  }>;
  recentTrends: Array<{
    date: string;
    average_rating: number;
  }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats>({
    totalBrews: 0,
    averageRating: 0,
    topCoffees: [],
    recentTrends: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total brews and average rating
      const { data: brewStats, error: brewError } = await supabase
        .from('coffee_brews')
        .select(`
          id,
          created_at,
          brew_ratings (overall_impression)
        `);

      if (brewError) throw brewError;

      const totalBrews = brewStats?.length || 0;
      const averageRating = brewStats?.reduce((acc, brew) => {
        return acc + (brew.brew_ratings?.[0]?.overall_impression || 0);
      }, 0) / totalBrews;

      // Fetch top coffees
      const { data: topCoffees, error: coffeeError } = await supabase
        .from('coffee_beans')
        .select(`
          name,
          roaster,
          coffee_brews (
            id,
            brew_ratings (overall_impression)
          )
        `);

      if (coffeeError) throw coffeeError;

      const processedTopCoffees = topCoffees
        ?.map(coffee => ({
          name: coffee.name,
          roaster: coffee.roaster,
          brew_count: coffee.coffee_brews.length,
          average_rating: coffee.coffee_brews.reduce((acc, brew) => {
            return acc + (brew.brew_ratings?.[0]?.overall_impression || 0);
          }, 0) / coffee.coffee_brews.length
        }))
        .sort((a, b) => b.average_rating - a.average_rating)
        .slice(0, 5);

      // Calculate recent trends (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const trends = last7Days.map(date => {
        const dayBrews = brewStats?.filter(brew => 
          brew.created_at.startsWith(date)
        );
        const average = dayBrews?.reduce((acc, brew) => {
          return acc + (brew.brew_ratings?.[0]?.overall_impression || 0);
        }, 0) / (dayBrews?.length || 1);

        return {
          date,
          average_rating: average || 0
        };
      });

      setStats({
        totalBrews,
        averageRating,
        topCoffees: processedTopCoffees || [],
        recentTrends: trends
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Brews</h3>
          <p className="text-3xl font-bold text-brown-600">{stats.totalBrews}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Rating</h3>
          <p className="text-3xl font-bold text-brown-600">
            {stats.averageRating.toFixed(1)}/10
          </p>
        </div>
      </div>

      {/* Top Coffees */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Rated Coffees</h3>
        <div className="space-y-4">
          {stats.topCoffees.map((coffee, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{coffee.roaster} - {coffee.name}</p>
                <p className="text-sm text-gray-500">{coffee.brew_count} brews</p>
              </div>
              <div className="text-lg font-semibold text-brown-600">
                {coffee.average_rating.toFixed(1)}/10
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Trends</h3>
        <div className="space-y-2">
          {stats.recentTrends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {new Date(trend.date).toLocaleDateString()}
              </p>
              <div className="text-sm font-medium text-brown-600">
                {trend.average_rating.toFixed(1)}/10
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}