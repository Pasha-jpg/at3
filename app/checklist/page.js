// app/checklist-items/page.js
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ChecklistItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/checklist-items')
      .then(res => {
        setItems(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading checklist items...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Checklist Items</h1>
      <p className="text-gray-600 mb-6">Track task checklist items</p>
      
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="border rounded-lg p-3 flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={item.is_completed} 
              readOnly 
              className="w-5 h-5"
            />
            <span className={item.is_completed ? 'line-through text-gray-500' : ''}>
              {item.name}
            </span>
            <span className="text-sm text-gray-400 ml-auto">
              Task: {item.task_id}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-gray-500">
        Total items: {items.length}
      </div>
    </div>
  );
}