"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Add error state

  useEffect(() => {
    api.get('/milestones')
      .then(res => {
        // Normalize data
        const normalizedMilestones = (res.data || []).map(milestone => ({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          target_date: milestone.target_date,
          project_id: milestone.project_id,
        }));
        setMilestones(normalizedMilestones);
        setLoading(false);
      })
      .catch(err => {  // Add error handling
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading milestones...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;  //  Show error

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Milestones</h1>
      <p className="text-gray-600 mb-6">Track project milestones and deadlines</p>  {/* Add description */}
      
      <div className="space-y-4">
        {milestones.map(milestone => (
          <div key={milestone.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold">{milestone.title}</h2>
            <p className="text-gray-600 mt-1">{milestone.description || 'No description'}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>Target: {milestone.target_date?.split('T')[0] || 'N/A'}</span>
              <span>Project ID: {milestone.project_id}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add total count footer */}
      <div className="mt-6 text-gray-500">
        Total milestones: {milestones.length}
      </div>
    </div>
  );
}