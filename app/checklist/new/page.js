"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

// ✅ Helper to safely extract array from API response
function extractArray(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
}

export default function CreateChecklistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    is_completed: false,
    task_id: ''
  });

  // Fetch tasks for dropdown
  useEffect(() => {
    api.get('/tasks')
      .then(res => {
        // ✅ Safely extract tasks array
        setTasks(extractArray(res));
      })
      .catch(err => {
        console.error('Failed to fetch tasks:', err);
        setTasks([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/checklist-items', formData);
      
      // Safely extract ID
      const newItem = response.data?.data || response.data;
      if (newItem && newItem.id) {
        router.push(`/checklist/${newItem.id}`);
      } else {
        router.push('/checklist');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create checklist item');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Checklist Item</h1>
        <a href="/checklist" className="text-gray-600 hover:text-gray-800">
          ← Back to Checklist Items
        </a>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Item Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter checklist item name"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-gray-700 text-sm font-bold">
            <input
              type="checkbox"
              name="is_completed"
              checked={formData.is_completed}
              onChange={handleChange}
              className="w-5 h-5"
            />
            Mark as Completed
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="task_id">
            Task *
          </label>
          <select
            id="task_id"
            name="task_id"
            value={formData.task_id}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a task...</option>
            {/* ✅ Array.isArray() prevents the crash */}
            {Array.isArray(tasks) && tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.title || task.name || 'Untitled Task'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-4">
          <a
            href="/checklist"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Checklist Item'}
          </button>
        </div>
      </form>
    </div>
  );
}